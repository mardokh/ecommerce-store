const { body, param, validationResult } = require('express-validator')


const safeTextRegex = /^[a-zA-Z0-9\s.,!?'\-%]+$/;

// VALIDATE GET USER //
const validateGetUser = [
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

// VALIDATE CREATE USER //
const validateCreateUser = [
    body('firstName')
        .notEmpty().withMessage('Le champ prenom est requis')
        .isLength({ max: 50 }).withMessage('Le champ prenom ne doit pas dépasse 50 caractères')
        .matches(safeTextRegex).withMessage('Le champ prenom contient des caractères invalides')
        .trim().escape().blacklist("<>'\""),

    body('lastName')
        .notEmpty().withMessage('Le champ nom est requis')
        .isLength({ max: 50 }).withMessage('Le champ nom ne doit pas dépasse 50 caractères')
        .matches(safeTextRegex).withMessage('Le champ nom contient des caractères invalides')
        .trim().escape().blacklist("<>'\""),

    body('email')
        .notEmpty().withMessage('Le champ email est requis')
        .isEmail().withMessage('Le champ email doit être une adresse email valide')
        .isLength({ max: 100 }).withMessage('Le champ email ne doit pas dépasser 100 caractères'),
    body('password')
        .notEmpty().withMessage('Le champ mot de passe est requis')
        .isLength({ min: 8 }).withMessage('Le champ mot de passe doit contenir au moins 8 caractères')
        .matches(/[A-Z]/).withMessage('Le champ mot de passe doit contenir au moins une lettre majuscule')
        .matches(/[a-z]/).withMessage('Le champ mot de passe doit contenir au moins une lettre minuscule')
        .matches(/[0-9]/).withMessage('Le champ mot de passe doit contenir au moins un chiffre')
        .matches(/[\W_]/).withMessage('Le champ mot de passe doit contenir au moins un caractère spécial')
        .trim().escape(),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ data: [], message: 'Validation failed', errors: errors.array().map(err => err.msg), type: 'Failed' })
        }
        next();
    }
]

// VALIDATE CREATE USER //
const validateLoginUser = [
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


module.exports = {validateGetUser, validateCreateUser, validateLoginUser}