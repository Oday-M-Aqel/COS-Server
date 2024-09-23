const { diskStorage } = require('multer');
const multer = require("multer");
const { join } = require("path");
const { existsSync, mkdirSync } = require('fs')

const ensureDirExists = (dir) => {
    if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
    }
};

const storage1 = diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = join(__dirname, '../uploads/avatar');
        ensureDirExists(uploadPath);
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const uploadUserAvatar = multer({
    storage: storage1,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(_extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('File upload only supports the following filetypes - ' + filetypes));
    }
}).single('avatar');

module.exports = { uploadUserAvatar };
