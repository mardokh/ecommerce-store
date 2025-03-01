const { body, param, validationResult } = require('express-validator')
const fs = require('fs');
const path = require('path');


const safeTextRegex = /^[^<>]*$/;

// Function to save files to disk
const saveFiles = (req) => {
    let savedFileNames = {}; // Initialize savedFileNames as an empty object
    if (req.files) {
        Object.entries(req.files).forEach(([field, files]) => {
            savedFileNames[field] = []; // Initialize array for field
            files.forEach((file, index) => {
                const fileExtension = path.extname(file.originalname);
                const fileName = `${field}-${Date.now()}-${index}${fileExtension}`;
                const filePath = path.join(__dirname, '../uploads', fileName);

                fs.writeFileSync(filePath, file.buffer); // Save file to disk
                savedFileNames[field].push(fileName); // Store generated filename
            });
        });
    }
    return savedFileNames;
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
        .notEmpty().withMessage('Le nom du produit est requis').bail()
        .isLength({ max: 100 }).withMessage('Le nom du produit ne doit pas dépasser 100 caractères').bail()
        .matches(safeTextRegex).withMessage('Le nom du produit contient des caractères invalides').bail()
        .trim(),

    body('details')
        .notEmpty().withMessage('Les détails du produit sont requis').bail()
        .isLength({ max: 500 }).withMessage('Les détails du produit ne doivent pas dépasser 500 caractères').bail()
        .matches(safeTextRegex).withMessage('Les détails du produit contiennent des caractères invalides').bail()
        .trim(),

    body('price')
        .notEmpty().withMessage('Le prix du produit est requis').bail()
        .isFloat({ min: 0.01 }).withMessage('Le prix doit etre un nombre positif').bail()
        .trim(),

    body('category_id')
        .isInt({ min: 1 })
        .withMessage('Product ID must be a positive integer'),

    body('image')
        .custom((value, { req }) => {
            if (!req.files || !req.files.image || !req.files.image[0]) {
                throw new Error('Une image principale est requise');
            }
            return true;
        }),

    body('images')
        .optional(), 

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ data: [], message: 'Validation failed', errors: errors.array().map(err => ({ field: err.path, message: err.msg })), type: 'Failed' })
        }
        req.savedFileNames = saveFiles(req);
        next();
    }
]

// VALIDATE UPDATE PRODUCT //
const validateUpdateProduct = [
    body('name')
        .notEmpty().withMessage('Le nom du produit est requis').bail()
        .isLength({ max: 150 }).withMessage('Le nom du produit ne doit pas dépasser 150 caractères').bail()
        .matches(safeTextRegex).withMessage('Le nom du produit contient des caractères invalides').bail()
        .trim(),

    body('details')
        .notEmpty().withMessage('Les détails du produit sont requis').bail()
        .isLength({ max: 500 }).withMessage('Les détails du produit ne doivent pas dépasser 500 caractères').bail()
        .matches(safeTextRegex).withMessage('Les détails du produit contiennent des caractères invalides').bail()
        .trim(),

    body('price')
        .notEmpty().withMessage('Le prix du produit est requis').bail()
        .isFloat({ min: 0.01 }).withMessage('Le champ prix doit contenir un nombre positif').bail()
        .trim(),
        
    body('category_id')
        .isInt({ min: 1 })
        .withMessage('Product ID must be a positive integer'),

    body('image')
    .custom((value, { req }) => {
        if (value) {
            if (!safeTextRegex.test(value)) {
                throw new Error('Image field content invalide characters');
            }
        }
        return true;
    }),

    body('images')
        .optional(),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ data: [], message: 'Validation failed', errors: errors.array().map(err => err.msg), type: 'Failed' })
        }
        req.savedFileNames = saveFiles(req);
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