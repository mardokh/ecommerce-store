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
        .notEmpty().withMessage('Votre Nom est requis').bail()
        .isLength({max: 50}).withMessage('Votre Nom ne doit pas dépasser 50 caractères').bail()
        .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/).withMessage('Votre Nom doit contenir seulement des lettres et des espaces').bail()
        .trim(),

    body('firstName')
        .notEmpty().withMessage('Votre prenom est requis').bail()
        .isLength({ max: 50 }).withMessage('Votre prenom ne doit pas dépasser 50 caractères').bail()
        .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/).withMessage('Votre Prenom doit contenir seulement des lettres et des espaces').bail()
        .trim(),

    body('email')
        .notEmpty().withMessage('Une adresse e-mail est requise').bail()
        .isLength({max: 50}).withMessage('Votre adresse e-mail ne doit pas dépasser 50 caractères').bail()
        .isEmail().withMessage('Votre e-mail doit etre une adresse valide').bail()
        .trim(),

    body('password')
        .notEmpty().withMessage('Un mot de passe est requis').bail()
        .isLength({min: 8, max: 20}).withMessage('Votre mot de passe doit contenir entre 8 et 20 caractères').bail()
        .matches(/\d/).withMessage('Votre mot de passe doit contenir au moins un chiffre').bail()
        .matches(/[A-Z]/).withMessage('Votre mot de passe doit contenir au moins une lettre majuscule').bail()
        .matches(/[a-z]/).withMessage('Votre mot de passe doit contenir au moins une lettre minuscule').bail()
        .matches(/^[A-Za-z0-9!@#$%^&*()_+={}\[\]:;"',.?/\\|-]*$/).withMessage('Votre mot de passe contien des caractères invalides')
        .trim(),

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