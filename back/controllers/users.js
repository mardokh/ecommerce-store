// MODULES IMPORTS //
const db = require('../models')
const Users = db.users
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


// CREATE USER //
exports.createUser = async (req, res) => {

    try {
        // Extract inputs
        const {firstName, lastName, email, password} = req.body

        // Check inputs
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({data: [], message: "Missing inpunt", type: "Failed"})
        }

        // Check if user exist
        const user = await Users.findOne({where: {email: email}})
        if (user !== null) {
            return res.status(409).json({data: [], message: 'Cette adresse exist deja', type: "Failed"})
        }

        // Password hash
        const hash = await bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT))

        // Update password with hash
        req.body.password = hash

        // Create user
        await Users.create(req.body)

        // Success response 
        return res.status(201).json({data: [], message: 'User created', type: "Success"})
    }
    catch (err) {
        return res.status(500).json({data: [], message: 'Database error', error: err.message, stack: err.stack, type: "Failed"})
    }

}

// LOGIN USER //
exports.loginUser = async (req, res) => {
    
    try {
        // Extract inputs
        const {identifiant, password} = req.body

        // Check inputs
        if (!identifiant || !password) {
            return res.status(400).json({data: [], message: "Missing or invalid inpunt", type: "Failed"})
        }

        // Check if user exist
        const user = await Users.findOne({where: {email: identifiant}})
        if (user === null) {
            return res.status(401).json({data: [], message: 'Mot de passe ou identifiant incorrect', type: "Failed"})
        }

        // Check password
        const passe = await bcrypt.compare(password, user.password)
        if (!passe) {
            return res.status(401).json({data: [], message: 'Mot de passe ou identifiant incorrect', type: "Failed"})
        }

        // Generate json web token
        const token = jwt.sign({
            id: user.id,
            identifiant: user.firstName
        }, process.env.JWT_SECRET, {expiresIn: "24h"})

        // Success response
        return res.status(200).json({data : {access_token: token, user_id: user.id}, message: "User logged", type: "Success"})
    }
    catch (err) {
        return res.status(500).json({data: [], message: 'Database error', error: err.message, stack: err.stack, type: "Failed"})
    }
}

// ADD USER //
exports.getUser = async (req, res) => {

    try {
        // Extract id
        const id = parseInt(req.params.id)

        // Validate id
        if (!id || !Number.isInteger(id)) {
            return res.status(400).json({data: [], message: 'Missing or invalid id', type: "Failed"})
        }

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