const { body, param, validationResult } = require('express-validator')
const fs = require('fs');
const path = require('path');


const safeTextRegex = /^[a-zA-Z0-9\s.,!?'\-]+$/;

// Function to save files to disk
const saveFiles = (req) => {
    if (req.files) {
        Object.entries(req.files).forEach(([field, files]) => {
            files.forEach((file, index) => {
                const fileExtension = path.extname(file.originalname);
                const fileName = `${field}-${Date.now()}-${index}${fileExtension}`;
                const filePath = path.join(__dirname, '../uploads', fileName);

                fs.writeFileSync(filePath, file.buffer); // Save file to disk
            });
        });
    }
};

// VALIDATE GET PRODUCT //
const validateGetProduct = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('Product ID must be a positive integer'),

    (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ data: [], message: 'Validation failed', errors: errors.array().map(err => err.msg), type: 'Failed' })
        }
        next()
    }
]

// VALIDATE CREATE PRODUCT //
const validateCreateProduct = [
    body('name')
        .notEmpty().withMessage('Le champ du nom de produit est requis')
        .isLength({ max: 100 }).withMessage('Le champ du nom de produit ne doit pas dépasse 100 caractères')
        .matches(safeTextRegex).withMessage('Le champ du nom de produit contient des caractères invalides')
        .trim().escape().blacklist("<>'\""),

    body('details')
        .notEmpty().withMessage('Le champ details est requis')
        .isLength({ max: 500 }).withMessage('Le champ details ne doit pas dépasse 500 caractères')
        .matches(safeTextRegex).withMessage('Le champ ddetails contient des caractères invalides')
        .trim().escape().blacklist("<>'\""),

    body('price')
        .isInt({ min: 1 })
        .withMessage('Le champ prix doit contenir un nombre positif'),

    body('image')
        .custom((value, { req }) => {
            if (!req.files || !req.files.image || !req.files.image[0]) {
                throw new Error('Une image principale est requise.');
            }
            return true;
    }),

    body('images')
        .custom((value, { req }) => {
            if (!req.files || !req.files['images'] || req.files['images'].length === 0) {
                throw new Error('Au moins une image secondaire est requise.');
            }
            return true;
    }),    

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ data: [], message: 'Validation failed', errors: errors.array().map(err => err.msg), type: 'Failed' })
        }
        saveFiles(req) // Save to disk
        next();
    }
]

// VALIDATE UPDATE PRODUCT //
const validateUpdateProduct = [
    body('id')
        .isInt({ min: 1 })
        .withMessage('Product ID must be a positive integer'),

    body('name')
        .notEmpty().withMessage('Le champ du nom de produit est requis')
        .isLength({ max: 100 }).withMessage('Le champ du nom de produit ne doit pas dépasse 100 caractères')
        .matches(safeTextRegex).withMessage('Le champ du nom de produit contient des caractères invalides')
        .trim().escape().blacklist("<>'\""),

    body('details')
        .notEmpty().withMessage('Le champ details est requis')
        .isLength({ max: 500 }).withMessage('Le champ details ne doit pas dépasse 500 caractères')
        .matches(safeTextRegex).withMessage('Le champ ddetails contient des caractères invalides')
        .trim().escape().blacklist("<>'\""),

    body('price')
        .isInt({ min: 1 })
        .withMessage('Le champ prix doit être un nombre positif'),

    body('image')
        .notEmpty().withMessage('Une image principale est requise'),

    body('images')
        .notEmpty().withMessage('Au moin une image secondaire est requise'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ data: [], message: 'Validation failed', errors: errors.array().map(err => err.msg), type: 'Failed' })
        }
        next();
    }
]

// VALIDATE DELETE PRODUCT //
const validateDeleteProduct = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('Product ID must be a positive integer'),

    (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ data: [], message: 'Validation failed', errors: errors.array().map(err => err.msg), type: 'Failed' })
        }
        next()
    }
]

// VALIDATE DELETE SECONDARY IMAGE //
const validateDeleteSecondaryImage = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('Product ID must be a positive integer'),

    (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ data: [], message: 'Validation failed', errors: errors.array().map(err => err.msg), type: 'Failed' })
        }
        next()
    }
]


module.exports = {validateGetProduct, validateCreateProduct, validateUpdateProduct, validateDeleteProduct, validateDeleteSecondaryImage}



