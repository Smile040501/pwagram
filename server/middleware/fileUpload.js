const multer = require("multer");
const { v4: uuid } = require("uuid");

const MIME_TYPE_MAP = {
    "image/png": "png",
    "image/jpeg": "png",
    "image/jpg": "jpg",
};

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/images");
    },
    filename: (req, file, cb) => {
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, uuid() + "." + ext);
    },
});

const fileFilter = (req, file, cb) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype];
    let error = isValid ? null : new Error("Invalid mime type!");
    cb(error, isValid);
};

const fileUpload = multer({
    limits: 500000,
    storage: fileStorage,
    fileFilter,
});

module.exports = fileUpload;
