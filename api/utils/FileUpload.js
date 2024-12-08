const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure upload directories exist
const ensureUploadDirsExist = () => {
  const avatarDir = path.join(__dirname, "..", "public", "uploads", "avatars");
  const resumeDir = path.join(__dirname, "..", "public", "uploads", "resumes");

  if (!fs.existsSync(avatarDir)) {
    fs.mkdirSync(avatarDir, { recursive: true });
  }
  if (!fs.existsSync(resumeDir)) {
    fs.mkdirSync(resumeDir, { recursive: true });
  }
};

// Configure multer storage for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = file.fieldname === "avatar" ? "avatars" : "resumes";
    ensureUploadDirsExist();
    cb(null, path.join(__dirname, "..", "public", "uploads", folder));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = req.user.sub || Date.now();
    cb(null, `${filename}-${file.fieldname}${ext}`);
  }
});

const fileUpload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
  fileFilter: (req, file, cb) => {
    const allowedImageTypes = /jpeg|jpg|png|gif/;
    const allowedFileTypes = /pdf|doc|docx/;
    const extname = allowedImageTypes.test(path.extname(file.originalname).toLowerCase()) || allowedFileTypes.test(path.extname(file.originalname).toLowerCase());

    if (extname) {
      return cb(null, true);
    } else {
      cb(new Error("File type not allowed"));
    }
  }
});

// Handle both avatar and resume in the same middleware
const uploadFiles = (req, res, next) => {
  fileUpload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "resume", maxCount: 1 }
  ])(req, res, (err) => {
    if (err) {
      console.error("Error uploading files:", err);
      return res.status(400).json({ error: err.message });
    }


    next();
  });
};

module.exports = { uploadFiles };


