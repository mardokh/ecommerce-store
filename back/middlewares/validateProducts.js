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
        .notEmpty().withMessage('Name is required')
        .isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters')
        .matches(safeTextRegex).withMessage('Invalid characters in name')
        .trim().escape().blacklist("<>'\""),

    body('details')
        .notEmpty().withMessage('Details are required')
        .isLength({ max: 500 }).withMessage('Details cannot exceed 500 characters')
        .matches(safeTextRegex).withMessage('Invalid characters in details')
        .trim().escape().blacklist("<>'\""),

    body('price')
        .isInt({ min: 1 })
        .withMessage('Price must be a positive number'),

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
        .notEmpty().withMessage('Name is required')
        .isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters')
        .matches(safeTextRegex).withMessage('Invalid characters in name')
        .trim().escape().blacklist("<>'\""),

    body('details')
        .notEmpty().withMessage('Details are required')
        .isLength({ max: 500 }).withMessage('Details cannot exceed 500 characters')
        .matches(safeTextRegex).withMessage('Invalid characters in details')
        .trim().escape().blacklist("<>'\""),

    body('price')
        .isInt({ min: 1 })
        .withMessage('Price must be a positive number'),

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



