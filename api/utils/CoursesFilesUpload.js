const multer = require("multer");
const path = require("path");
const fs = require("fs");


const ensureUploadDirsExist = (courseTitle, chapterTitle) => {
    try {
        const courseDir = path.join(__dirname, "..", "public", "uploads", courseTitle);
        const chapterDir = path.join(courseDir, chapterTitle);
        if (!courseTitle || typeof courseTitle !== 'string') {
            throw new Error("Course title is missing or invalid.");
        }
        if (!chapterTitle || typeof chapterTitle !== 'string') {
            throw new Error("Chapter title is missing or invalid.");
        }
        console.log(fs.existsSync(courseDir), 'courseDir')
        console.log(fs.existsSync(chapterDir), 'chapterDir')
        if (!fs.existsSync(courseDir)) {
            fs.mkdirSync(courseDir, { recursive: true });
        }

        if (!fs.existsSync(chapterDir)) {
            fs.mkdirSync(chapterDir, { recursive: true });
        }

        return chapterDir;
    } catch (err) {
        console.error("Error ensuring upload dirs exist:", err);
        return null;
    }
};
const ensureUploadDirsExistThumbnail = (courseTitle) => {
    const courseDir = path.join(__dirname, "..", "public", "uploads", courseTitle);

    if (!fs.existsSync(courseDir)) {
        fs.mkdirSync(courseDir, { recursive: true });
    }

    return courseDir;
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const { title, chapterTitle } = req.body;

        if (file.fieldname === "thumbnail") {
            const courseDir = ensureUploadDirsExistThumbnail(title);
            cb(null, courseDir);
        } else if (file.fieldname === "files") {
            const chapterDir = ensureUploadDirsExist(title, chapterTitle);
            cb(null, chapterDir);
        } else {
            cb(new Error("Invalid fieldname"));
        }
    },
    filename: (req, file, cb) => {
        if (file.fieldname === "thumbnail") {
            const ext = path.extname(file.originalname);
            const filename = "thumbnail" + ext;
            cb(null, filename);
        } else {
            const ext = path.extname(file.originalname);
            const filename = file.originalname;
            cb(null, filename);
        }
    }
});

const fileUpload = multer({
    storage,
    limits: { fileSize: 300 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedImageTypes = /jpeg|jpg|png|gif/;
        const allowedFileTypes = /pdf|doc|docx|mp4|avi|mov|mkv/;
        const extname = allowedImageTypes.test(path.extname(file.originalname).toLowerCase()) || allowedFileTypes.test(path.extname(file.originalname).toLowerCase());

        if (extname) {
            return cb(null, true);
        } else {
            cb(new Error("File type not allowed"));
        }
    }
});


const uploadFiles = (req, res, next) => {
    fileUpload.fields([
        { name: "files", maxCount: 10 }, // Multiple files
        { name: "thumbnail", maxCount: 1 }
    ])(req, res, (err) => {
        if (err) {
            console.error("Error uploading files:", err);
            return res.status(400).json({ error: err.message });
        }
        if (!req.files['files']) {
            return res.status(400).json({ error: "No files uploaded" });
        }
        const fileOrders = req.body.fileOrders || [];
        const fileDetails = req.files['files'].map((file, index) => {

            const order = fileOrders[index];

            return {
                filename: file.filename,
                extension: path.extname(file.originalname).toLowerCase(),
                url: file.path,
                order: order
            };
        });
        req.fileDetails = fileDetails;
        const thumbnailDetails = req.files["thumbnail"]?.map((file) => ({
            filename: file.filename,
            extension: path.extname(file.originalname).toLowerCase(),
            url: file.path,

        })) || [];
        req.thumbnailDetails = thumbnailDetails[0];
        next();
    });
};

module.exports = { uploadFiles };
