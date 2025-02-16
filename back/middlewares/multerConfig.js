const multer = require('multer');


// Allowed MIME types
const validMimeTypes = ['image/png', 'image/jpg', 'image/jpeg'];

// Multer storage (stores files in memory instead of disk)
const storage = multer.memoryStorage();

// File filter function
const fileFilter = (req, file, callback) => {
    if (!validMimeTypes.includes(file.mimetype)) {
        return callback(new Error('Format invalide, (png, jpg, jpeg) seulement'));
    }
    callback(null, true);
};

// Multer configuration with memory storage
const multerUpload = multer({
    storage: storage, // No files are written to disk initially
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB size limit
    fileFilter: fileFilter
}).fields([
    { name: 'image', maxCount: 1 },
    { name: 'images', maxCount: 8 }
]);

// Middleware for handling errors and validation
const upload = (req, res, next) => {
    multerUpload(req, res, (err) => {
        if (err) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ error: "Votre image ne doit pas depassé 2MB" });
            }
            if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                return res.status(400).json({ error: "Nombre d'image depassé (maximum 10 images)" });
            }
            return res.status(400).json({ error: err.message || "Something went wrong during file upload" });
        }
        next();
    });
};


module.exports = upload
