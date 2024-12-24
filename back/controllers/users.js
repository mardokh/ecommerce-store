// MODULES IMPORTS //
const db = require('../models')
const Users = db.users
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


// CREATE USER //
exports.createUser = async (req, res) => {

    try {
        // Get data from body request
        const {firstName, lastName, email, password} = req.body

        // Check data inputs
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({message: "Missing inpunt !"})
        }

        // Fetch user into table
        const user = await Users.findOne({where: {email: email}})

        // Check if user exist
        if (user !== null) {
            return res.status(409).json({message: 'Cette adresse exist deja !'})
        }

        // Password hash
        const hash = await bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT))

        // Update password with hash
        req.body.password = hash

        // Create user
        await Users.create(req.body)

        // Send successfully 
        return res.json({message: 'User created successfully'})
        
    }
    catch (err) {
        return res.status(500).json({ message: 'Database error !', error: err.message, stack: err.stack })
    }

}

// LOGIN USER //
exports.loginUser = async (req, res) => {
    
    try {
        // Get data from body request
        const {identifiant, password} = req.body

        // Check data inputs
        if (!identifiant || !password) {
            return res.status(400).json({message: "Missing inpunt !"})
        }

        // Fetch user into table
        const user = await Users.findOne({where: {email: identifiant}})

        // Check if user exist
        if (user === null) {
            return res.status(401).json({message: 'Mot de passe ou identifiant incorrect !'})
        }

        // Check password from database
        const passe = await bcrypt.compare(password, user.password)

        // Check if password
        if (!passe) {
            return res.status(401).json({message: 'Mot de passe ou identifiant incorrect !'})
        }

        // Generate json web token
        const token = jwt.sign({
            id: user.id,
            identifiant: user.firstName
        }, process.env.JWT_SECRET, {expiresIn: "24h"})

        // Send token 
        return res.json({access_token: token, user_id: user.id})
          
    }
    catch (err) {
        return res.status(500).json({message: 'Database error !', error: err.message, stack: err.stack})
    }
}

// ADD USER //
exports.getUser = async (req, res) => {

    try {
        // Extract id from request
        const userId = parseInt(req.params.id)

        // Check id validity
        if (!userId) {
            return res.status(400).json({message: 'Missing id params from getUser !'})
        }

        // Get user from database
        const user = await Users.findOne({where: {id: userId}})

        // Check if user exist
        if (user === null) {
            return res.status(404).json({message: 'THis user do not exist !'})
        }

        // Send user successfully
        return res.json({data: user})

    }
    catch (err) {
        return res.status(500).json({ message: 'Database error !', error: err.message, stack: err.stack })
    }
}