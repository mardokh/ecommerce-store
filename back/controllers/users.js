// MODULES IMPORTS //
const db = require('../models')
const Users = db.users
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


// ADD USER //
exports.getUser = async (req, res) => {
    try {
        // Extract id
        const id = parseInt(req.params.id)
        
        // Check if user exist
        const user = await Users.findOne({where: {id}})
        if (user === null) {
            return res.status(404).json({data: [], message: 'This user do not exist', type: "Failed"})
        }

        // Send user successfully
        return res.status(200).json({data: user, message: "User obtained", type: "Success"})
    }
    catch (err) {
        return res.status(500).json({data: [], message: 'Database error', error: err.message, stack: err.stack, type: "Failed"})
    }
}

// CREATE USER //
exports.createUser = async (req, res) => {
    try {
        // Extract inputs
        const {firstName, lastName, email, password} = req.body

        // Check if user exist
        const user = await Users.findOne({where: {email: email}})
        if (user !== null) {
            return res.status(409).json({data: [], message: 'Un compte est déjà associé à cet e-email veuillez saisir une autres adresse', type: "Failed"})
        }

        // Password hash
        const hashPass = await bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT))

        // Create user
        const newUser = await Users.create({firstName, lastName, email, password: hashPass})

        // Generate json web token
        const token = jwt.sign({
            id: newUser.id,
            email: newUser.email
        }, process.env.JWT_SECRET, {expiresIn: "24h"})

        // Success response 
        return res.status(200).json({data : {access_token: token, user_id: newUser.id}, message: "User created", type: "Success"})
    }
    catch (err) {
        return res.status(500).json({data: [], message: 'Database error', error: err.message, stack: err.stack, type: "Failed"})
    }
}

// LOGIN USER //
exports.loginUser = async (req, res) => {
    try {
        // Extract inputs
        const {email, password} = req.body

        // Check if user exist
        const user = await Users.findOne({where: {email}})
        if (user === null) {
            return res.status(401).json({data: [], message: 'Mot de passe ou email incorrect', type: "Failed"})
        }

        // Check password
        const passe = await bcrypt.compare(password, user.password)
        if (!passe) {
            return res.status(401).json({data: [], message: 'Mot de passe ou email incorrect', type: "Failed"})
        }

        // Generate json web token
        const token = jwt.sign({
            id: user.id,
            email: user.email
        }, process.env.JWT_SECRET, {expiresIn: "24h"})

        // Success response
        return res.status(200).json({data : {access_token: token, user_id: user.id}, message: "User logged", type: "Success"})
    }
    catch (err) {
        return res.status(500).json({data: [], message: 'Database error', error: err.message, stack: err.stack, type: "Failed"})
    }
}