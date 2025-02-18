const { body, param, validationResult } = require('express-validator')


const safeTextRegex = /^[^<>]*$/;

// VALIDATE GET PRODUCT REVIEWS //
const validateGetPrdReviews = [
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

// VALIDATE CREATE PRODUCT REVIEWS //
const validateCreatePrdReviews = [
    body('user_id')
        .isInt({ min: 1 })
        .withMessage('User ID must be a positive integer'),

    body('product_id')
        .isInt({ min: 1 })
        .withMessage('Product ID must be a positive integer'),

    body('comment')
        .notEmpty().withMessage('Un commentaire est requis')
        .isLength({ max: 500 }).withMessage('Votre commentaire ne doit pas dépasser 500 caractères')
        .matches(safeTextRegex).withMessage('Votre commentaire contient des caractères invalides')
        .trim(),

    body('note')
        .isInt({ min: 1 })
        .withMessage('Note must be a positive integer'),

    (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ data: [], message: 'Validation failed', errors: errors.array().map(err => err.msg), type: 'Failed' })
        }
        next()
    }
]

// VALIDATE UPDATE PRODUCT REVIEWS //
const validateUpdatePrdReviews = [
    body('user_id')
        .isInt({ min: 1 })
        .withMessage('User ID must be a positive integer'),

    body('product_id')
        .isInt({ min: 1 })
        .withMessage('Product ID must be a positive integer'),

    body('comment')
        .notEmpty().withMessage('Un commentaire est requis')
        .isLength({ max: 500 }).withMessage('Votre commentaire ne doit pas dépasser 500 caractères')
        .matches(safeTextRegex).withMessage('Votre commentaire contient des caractères invalides')
        .trim(),

    body('note')
        .isInt({ min: 1 })
        .withMessage('Note must be a positive integer'),

    (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ data: [], message: 'Validation failed', errors: errors.array().map(err => err.msg), type: 'Failed' })
        }
        next()
    }
]

// VALIDATE DELETE PRODUCT REVIEWS //
const validateDeletePrdReviews = [
    param('reviewId')
        .isInt({ min: 1 })
        .withMessage('Review ID must be a positive integer'),

    param('userId')
        .isInt({ min: 1 })
        .withMessage('User ID must be a positive integer'),

    param('productId')
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


module.exports = {validateGetPrdReviews, validateCreatePrdReviews, validateUpdatePrdReviews, validateDeletePrdReviews}