const { body, param, cookie, validationResult } = require('express-validator')


// VALDIATION GET SHOPPING CARTS //
const validateGetshoppingCarts = [
    cookie('client_id_shopping_carts')
        .optional()
        .isUUID(4).withMessage('Invalid client_id format'),

    (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ data: [], message: 'Validation failed', errors: errors.array(), type: 'Failed' })
        }
        next()
    }
]

// Validation for getting favorite products
const validateCreateshoppingCarts = [
    cookie('client_id_shopping_carts')
        .optional()
        .isUUID(4)
        .withMessage('Invalid client_id format'),

    body('id')
        .notEmpty().withMessage('ID is required')
        .isInt({ min: 1 })
        .withMessage('Product ID must be a positive integer'),

    body('quantity')
        .notEmpty().withMessage('Quantity is required')
        .isInt({min: 1})
        .withMessage('Quantity must be a positive integer'),    

    (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ data: [], message: 'Validation failed', errors: errors.array(), type: 'Failed' })
        }
        next()
    }
]

const validateDeleteshoppingCarts = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('Product ID must be a positive integer'),

    param('limit')
        .matches('limit').withMessage('Filed should be matche with << limit >>')
        .trim(),

    (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ data: [], message: 'Validation failed', errors: errors.array().map(err => err.msg), type: 'Failed' })
        }
        next()
    }
]


module.exports = {validateGetshoppingCarts, validateCreateshoppingCarts, validateDeleteshoppingCarts}