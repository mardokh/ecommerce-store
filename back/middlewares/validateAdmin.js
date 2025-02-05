const { body, param, validationResult } = require('express-validator')


const safeTextRegex = /^[a-zA-Z0-9\s.,!?'\-%]+$/;

// VALIDATE CREATE USER //
const validateCreateAdmin = [
    body('identifiant')
        .notEmpty().withMessage('Le champ prenom est requis')
        .isLength({ max: 50 }).withMessage('Le champ prenom ne doit pas dépasse 50 caractères')
        .matches(safeTextRegex).withMessage('Le champ prenom contient des caractères invalides')
        .trim().escape().blacklist("<>'\""),

    body('password')
        .notEmpty().withMessage('Le champ nom est requis')
        .isLength({ max: 50 }).withMessage('Le champ nom ne doit pas dépasse 50 caractères')
        .matches(safeTextRegex).withMessage('Le champ nom contient des caractères invalides')
        .trim().escape().blacklist("<>'\""),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ data: [], message: 'Validation failed', errors: errors.array().map(err => err.msg), type: 'Failed' })
        }
        next();
    }
]

// VALIDATE CREATE USER //
const validateLoginAdmin = [
    body('identifiant')
        .notEmpty().withMessage('Le champ prenom est requis')
        .isLength({ max: 50 }).withMessage('Le champ prenom ne doit pas dépasse 50 caractères')
        .matches(safeTextRegex).withMessage('Le champ prenom contient des caractères invalides')
        .trim().escape().blacklist("<>'\""),

    body('password')
        .notEmpty().withMessage('Le champ nom est requis')
        .isLength({ max: 50 }).withMessage('Le champ nom ne doit pas dépasse 50 caractères')
        .matches(safeTextRegex).withMessage('Le champ nom contient des caractères invalides')
        .trim().escape().blacklist("<>'\""),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ data: [], message: 'Validation failed', errors: errors.array().map(err => err.msg), type: 'Failed' })
        }
        next();
    }
]


module.exports = {validateCreateAdmin, validateLoginAdmin}