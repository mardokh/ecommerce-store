const { body, param, validationResult } = require('express-validator')

const safeTextRegex = /^(?!.*[<>]).*$/u;

// VALIDATE GET PRODUCT REVIEWS //
const validateGetRcpReviews = [
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

// VALIDATE CREATE PRODUCT REVIEWS //
const validateCreateRcpReviews = [
    body('user_id')
        .isInt({ min: 1 })
        .withMessage('User ID must be a positive integer'),

    body('recipe_id')
        .isInt({ min: 1 })
        .withMessage('Recipe ID must be a positive integer'),

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
const validateUpdateRcpReviews = [
    body('user_id')
        .isInt({ min: 1 })
        .withMessage('User ID must be a positive integer'),

    body('recipe_id')
        .isInt({ min: 1 })
        .withMessage('Recipe ID must be a positive integer'),

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
const validateDeleteRcpReviews = [
    param('reviewId')
        .isInt({ min: 1 })
        .withMessage('Review ID must be a positive integer'),

    param('userId')
        .isInt({ min: 1 })
        .withMessage('User ID must be a positive integer'),

    param('recipeId')
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


module.exports = {validateGetRcpReviews, validateCreateRcpReviews, validateUpdateRcpReviews, validateDeleteRcpReviews}