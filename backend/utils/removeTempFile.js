import fs from "fs/promises";
const removeTempFile = async (path) => {
  try {
    await fs.unlink(path);
    // temp file removed
  } catch (error) {
    console.error(`Error removing temp file ${path}:`, error.message);
  }
};

export default removeTempFile;
