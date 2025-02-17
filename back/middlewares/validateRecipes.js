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

// VALIDATE GET RECIPE //
const validateGetRecipe = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('Recipe ID must be a positive integer'),

    (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ data: [], message: 'Validation failed', errors: errors.array().map(err => err.msg), type: 'Failed' })
        }
        next()
    }
]

// VALIDATE CREATE RECIPE //
const validateCreateRecipe = [
    body('name')
        .notEmpty().withMessage('Le nom de la recette est requis').bail()
        .isLength({ max: 100 }).withMessage('Le nom de la recette ne doit pas dépasser 100 caractères').bail()
        .matches(safeTextRegex).withMessage('Le nom de la recette contient des caractères invalides').bail()
        .trim(),

    body('ingredients')
        .notEmpty().withMessage('Les ingredients de la recette sont requis').bail()
        .isLength({ max: 800 }).withMessage('Les ingredients de la recette ne doivent pas dépasse 800 caractères').bail()
        .matches(safeTextRegex).withMessage('Les ingredients de la recette contiennent des caractères invalides').bail()
        .trim(),

    body('directions')
        .notEmpty().withMessage('Les directions de recette sont est requises').bail()
        .isLength({ max: 800 }).withMessage('Les directions de recette ne doivent pas dépasse 800 caractères').bail()
        .matches(safeTextRegex).withMessage('Les directions de recette contiennent des caractères invalides').bail()
        .trim(),

    body('image')
        .custom((value, { req }) => {
            if (!req.files || !req.files.image || !req.files.image[0]) {
                throw new Error('Une image principale est requise');
            }
            return true;
        }),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ data: [], message: 'Validation failed', errors: errors.array().map(err => err.msg), type: 'Failed' })
        }
        req.savedFileNames = saveFiles(req);
        next();
    }
]

// VALIDATE UPDATE RECIPE //
const validateUpdateRecipe = [
    body('id')
        .isInt({ min: 1 })
        .withMessage('Recipe ID must be a positive integer'),

    body('name')
        .notEmpty().withMessage('Le champ du nom de produit est requis')
        .isLength({ max: 100 }).withMessage('Le champ du nom de produit ne doit pas dépasse 100 caractères')
        .matches(safeTextRegex).withMessage('Le champ du nom de produit contient des caractères invalides')
        .trim().escape().blacklist("<>'\""),

    body('ingredients')
        .notEmpty().withMessage('Le champ details est requis')
        .isLength({ max: 500 }).withMessage('Le champ details ne doit pas dépasse 500 caractères')
        .matches(safeTextRegex).withMessage('Le champ details contient des caractères invalides')
        .trim().escape().blacklist("<>'\""),

    body('directions')
        .notEmpty().withMessage('Le champ details est requis')
        .isLength({ max: 500 }).withMessage('Le champ details ne doit pas dépasse 500 caractères')
        .matches(safeTextRegex).withMessage('Le champ details contient des caractères invalides')
        .trim().escape().blacklist("<>'\""),

    body('image')
    .custom((value, { req }) => {
        if (value) {
            if (!safeTextRegex.test(value)) {
                throw new Error('Le champ image contient des caractères invalides');
            }
        }
        return true;
    }),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ data: [], message: 'Validation failed', errors: errors.array().map(err => err.msg), type: 'Failed' })
        }
        req.savedFileNames = saveFiles(req);
        next();
    }
]

// VALIDATE DELETE RECIPE //
const validateDeleteRecipe = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('Recipe ID must be a positive integer'),

    (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ data: [], message: 'Validation failed', errors: errors.array().map(err => err.msg), type: 'Failed' })
        }
        next()
    }
]


module.exports = {validateGetRecipe, validateCreateRecipe, validateUpdateRecipe, validateDeleteRecipe}