import fs from "fs/promises";
const removeTempFile = async (path) => {
  try {
    await fs.unlink(path);
  } catch (error) {
    // Silently handle file removal errors
  }
};

export default removeTempFile;
