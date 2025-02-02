const { body, param, cookie, validationResult } = require('express-validator')

// Validation for getting favorite products
const validateGetFavorites = [
    cookie('client_id_favorites_products')
        .optional()
        .isUUID(4)
        .withMessage('Invalid client_id format'),

    (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ data: [], message: 'Validation failed', errors: errors.array(), type: 'Failed' })
        }
        next()
    }
]

// Validation rules for creating a favorite product
const validateCreateFavorite = [
    cookie('client_id_favorites_products')
        .optional()
        .isUUID(4)
        .withMessage('Invalid client_id format'),

    body('id')
        .isInt({ min: 1 })
        .withMessage('Product ID must be a positive integer'),

    (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ data: [], message: 'Validation failed', errors: errors.array(), type: 'Failed' })
        }
        next()
    }
]

// Validation rules for deleting a favorite product
const validateDeleteFavorite = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('Product ID must be a positive integer'),

    (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ data: [], message: 'Validation failed', errors: errors.array(), type: 'Failed' })
        }
        next()
    }
]

module.exports = { validateGetFavorites, validateCreateFavorite, validateDeleteFavorite }
