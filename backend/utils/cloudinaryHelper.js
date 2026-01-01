import { v2 as cloudinary } from "cloudinary";
import logger from "./logger.js";

/**
 * Delete a resource from Cloudinary with timeout handling
 * @param {string} publicId - The public ID of the resource to delete
 * @param {number} timeoutMs - Timeout in milliseconds (default: 10000)
 * @returns {Promise<object>} - The deletion result
 */
export const deleteCloudinaryResource = async (publicId, timeoutMs = 10000) => {
  return new Promise((resolve, reject) => {
    let timeoutId;

    try {
      // Set a timeout for the Cloudinary operation
      timeoutId = setTimeout(() => {
        const error = new Error(`Cloudinary deletion timeout for ${publicId}`);
        error.code = "TIMEOUT";
        reject(error);
      }, timeoutMs);

      // Execute the Cloudinary deletion
      cloudinary.uploader.destroy(publicId, (error, result) => {
        clearTimeout(timeoutId);
        
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    } catch (error) {
      clearTimeout(timeoutId);
      reject(error);
    }
  });
};

/**
 * Safe delete with retry logic
 * @param {string} publicId - The public ID of the resource to delete
 * @param {number} maxRetries - Maximum number of retries (default: 2)
 * @param {number} timeoutMs - Timeout in milliseconds per attempt (default: 10000)
 * @returns {Promise<object>} - The deletion result or error info
 */
export const safeDeleteCloudinaryResource = async (
  publicId,
  maxRetries = 2,
  timeoutMs = 10000
) => {
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      logger.info(`Deleting Cloudinary resource: ${publicId} (attempt ${attempt}/${maxRetries})`);
      const result = await deleteCloudinaryResource(publicId, timeoutMs);
      logger.info(`Successfully deleted: ${publicId}`);
      return result;
    } catch (error) {
      lastError = error;
      logger.warn(
        `Attempt ${attempt} failed for ${publicId}: ${error.message}`
      );
      
      // If this is not the last attempt, wait before retrying
      if (attempt < maxRetries) {
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 * attempt) // Exponential backoff
        );
      }
    }
  }

  // All retries failed, log but don't throw (non-blocking error)
  logger.error(
    `Failed to delete Cloudinary resource after ${maxRetries} attempts: ${publicId}`,
    lastError
  );

  return {
    error: true,
    message: `Failed to delete resource: ${lastError?.message || "Unknown error"}`,
    publicId,
  };
};

/**
 * Extract public ID from Cloudinary URL
 * @param {string} imageUrl - The full Cloudinary image URL
 * @returns {string} - The public ID
 */
export const extractPublicId = (imageUrl) => {
  if (!imageUrl) return null;
  
  try {
    // URL format: https://res.cloudinary.com/{cloud_name}/image/upload/{path}/{public_id}.{ext}
    const parts = imageUrl.split("/");
    const fileWithExt = parts[parts.length - 1];
    const publicId = fileWithExt.split(".")[0];
    
    // Get the full path including folders
    const uploadIndex = parts.indexOf("upload");
    if (uploadIndex !== -1) {
      const pathParts = parts.slice(uploadIndex + 1);
      return pathParts.join("/").split(".")[0];
    }
    
    return publicId;
  } catch (error) {
    logger.error(`Error extracting public ID from ${imageUrl}:`, error.message);
    return null;
  }
};

/**
 * Background cleanup function - starts image deletion but doesn't wait for completion
 * Used for fast deletion responses where we delete DB first, then cleanup images in background
 * @param {string} publicId - The public ID of the resource to delete
 * @returns {void} - Starts async cleanup without awaiting
 */
export const backgroundDeleteCloudinaryResource = (publicId) => {
  // Fire and forget - don't await, just start the cleanup
  safeDeleteCloudinaryResource(publicId).catch((error) => {
    logger.error(`Background Cloudinary cleanup failed for ${publicId}:`, error.message);
    // Silently fail - the DB is already deleted, just log for monitoring
  });
};

/**
 * Cleanup images for a single product in the background
 * Deletes all images without blocking the main response
 * @param {object} product - Product object with mainImage and images arrays
 * @returns {void}
 */
export const backgroundCleanupProductImages = (product) => {
  if (!product) return;

  // Delete main image in background
  if (product.mainImage) {
    const mainPublicId = extractPublicId(product.mainImage);
    if (mainPublicId) {
      const fullPublicId = `ecommerce/products/main/${mainPublicId}`;
      backgroundDeleteCloudinaryResource(fullPublicId);
    }
  }

  // Delete additional images in background
  if (product.images && product.images.length > 0) {
    for (const imageUrl of product.images) {
      if (imageUrl && imageUrl !== product.mainImage) {
        const publicId = extractPublicId(imageUrl);
        if (publicId) {
          const fullPublicId = `ecommerce/products/additional/${publicId}`;
          backgroundDeleteCloudinaryResource(fullPublicId);
        }
      }
    }
  }
};

/**
 * Cleanup images for multiple products in the background
 * Deletes all images in parallel without blocking the main response
 * @param {array} products - Array of product objects
 * @returns {void}
 */
export const backgroundCleanupMultipleProductImages = (products) => {
  if (!Array.isArray(products)) return;

  for (const product of products) {
    backgroundCleanupProductImages(product);
  }
};
