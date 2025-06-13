import multer from "multer";

const storage = multer.memoryStorage(); // For direct access to file.buffer

export const singleUpload = multer({ storage }).single("file");
