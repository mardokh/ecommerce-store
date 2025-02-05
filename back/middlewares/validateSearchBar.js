const { query, validationResult } = require('express-validator')


const safeTextRegex = /^[a-zA-Z0-9\s.,!?'\-%]+$/;

// Validation rules for deleting a favorite product
const validateSearch = [
    query('q')
        .matches(safeTextRegex).withMessage('Le champ de recherche contient des caractères invalides')
        .trim().escape().blacklist("<>'\""),

    (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ data: [], message: 'Validation failed', errors: errors.array(), type: 'Failed' })
        }
        next()
    }
]


module.exports = {validateSearch}