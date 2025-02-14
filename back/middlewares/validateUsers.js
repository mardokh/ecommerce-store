const { body, param, validationResult } = require('express-validator')


// VALIDATE GET USER //
const validateGetUser = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('User ID must be a positive integer'),

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
    body('lastName')
        .notEmpty().withMessage('Le champ Nom est requis').bail()
        .isLength({ max: 20 }).withMessage('Votre Nom ne doit pas excéder 20 caractères').bail()
        .isAlpha().withMessage('Votre Nom doit contenir seulment des lettres').bail()
        .trim().escape(),

    body('firstName')
        .notEmpty().withMessage('Le champ Prenom est requis').bail()
        .isLength({ max: 20 }).withMessage('Votre Prenom ne doit pas excéder 20 caractères').bail()
        .isAlpha().withMessage('Votre Prenom doit contenir seulment des lettres').bail()
        .trim().escape(),

    body('email')
        .notEmpty().withMessage('Le champ Email est requis').bail()
        .isEmail().withMessage('Vote Email doit etre une adresse valide').bail(),

    body('password')
        .notEmpty().withMessage('Le champ Mot de passe est requis').bail()
        .isLength({ min: 8, max: 12 }).withMessage('Le Mot de passe doit contenir entre 8 et 12 caractères').bail()
        .matches(/\d/).withMessage('Le Mot de passe doit contenir au moins un chiffre').bail()
        .matches(/[A-Z]/).withMessage('Le Mot de passe doit contenir au moins une lettre majuscule').bail()
        .matches(/[a-z]/).withMessage('Le Mot de passe doit contenir au moins une lettre minuscule').bail()
        .isAlphanumeric().withMessage('Le Mot de passe doit contenir uniquement des lettres et des chiffres').bail()
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
    body('email')
        .notEmpty().withMessage('Une adresse email est requise').bail(),

    body('password')
        .notEmpty().withMessage('Un mot de passe est requis').bail(),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ data: [], message: 'Validation failed', errors: errors.array().map(err => err.msg), type: 'Failed' })
        }
        next();
    }
]


module.exports = {validateGetUser, validateCreateUser, validateLoginUser}