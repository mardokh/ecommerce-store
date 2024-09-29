// MODULES IMPORTS //
const DB = require('../db.config')
const Admin = DB.admin
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


// ADD ADMIN //
exports.createAdmin = async (req, res) => {

    try {
        // Get data from body request 
        const {identifiant, password} = req.body

        // Check data inputs
        if (!identifiant || !password) {
            return res.status(400).json({message: 'Missing inputs !'})
        }

        // Fetch admin into table
        const admin = await Admin.findOne({where: {identifiant: identifiant}})

        // Check if admin exist
        if (admin !== null) {
            return res.status(409).json({message: `This user ${identifiant} already exist`})
        }

        // Password hash
        const hash = await bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT))
        
        // Update password with hash
        req.body.password = hash

        // Create admin
        await Admin.create(req.body)

        // Send successfully
        return res.json({message: 'Admin created succesfully'})

    }
    catch (err) {
        return res.status(500).json({ message: 'Database error !', error: err.message, stack: err.stack })
    }
}

// LOGIN ADMIN //
exports.loginAdmin = async (req, res) => {

    try {
        // Get data from body request 
        const {identifiant, password} = req.body

        // Check data inputs
        if (!identifiant || !password) {
            return res.status(400).json({message: 'Missing inputs !'})
        }

        // Fetch admin from database
        const admin = await Admin.findOne({where: {identifiant: identifiant}})

        // Check if admin exist
        if (admin === null) {
            return res.status(401).json({message: 'Mot de passe ou identifiant incorrect !'})
        }

        // Check password from database
        const passe = await bcrypt.compare(password, admin.password)

        // Check if password
        if (!passe) {
            return res.status(401).json({message: 'Mot de passe ou identifiant incorrect !'})
        }

        // Generate json web token
        const token = jwt.sign({
            id: admin.id,
            identifiant: admin.identifiant
        }, process.env.JWT_SECRET, {expiresIn: "24h"})

        // Send token 
        return res.json({access_token : token})
        
    }
    catch (err) {
        return res.status(500).json({message: 'Database error !', error: err.message, stack: err.stack})
    }
}