// MODULES IMPORTS //
const db = require('../models')
const Admin = db.admin
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


// ADD ADMIN //
exports.createAdmin = async (req, res) => {
    try {
        // Extract inputs
        const {identifiant, password} = req.body

        // Check inputs
        if (!identifiant || !password) {
            return res.status(400).json({data: [], message: 'Missing or invalid inputs', type: "Failed"})
        }

        // Check if admin exist
        const admin = await Admin.findOne({where: {identifiant}})
        if (admin !== null) {
            return res.status(409).json({data: [], message: 'This admin already exist', type: "Failed"})
        }

        // Password hash
        const hash = await bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT))
        
        // Update password with hash
        req.body.password = hash

        // Create admin
        await Admin.create(req.body)

        // Success response
        return res.json({data: [], message: 'Admin created', type: "Success"})
    }
    catch (err) {
        return res.status(500).json({data: [], message: 'Database error', error: err.message, stack: err.stack, type: "Failed"})
    }
}

// LOGIN ADMIN //
exports.loginAdmin = async (req, res) => {

    try {
        // Get data from body request 
        const {identifiant, password} = req.body

        // Check data inputs
        if (!identifiant || !password) {
            return res.status(400).json({data: [], message: 'Missing or invalid inputs', type: "Failed"})
        }

        // Check if admin exist
        const admin = await Admin.findOne({where: {identifiant: identifiant}})
        if (admin === null) {
            return res.status(401).json({data: [], message: 'Mot de passe ou identifiant incorrect', type: "Failed"})
        }

        // Check password
        const passe = await bcrypt.compare(password, admin.password)
        if (!passe) {
            return res.status(401).json({data: [], message: 'Mot de passe ou identifiant incorrect', type: "Failed"})
        }

        // Generate json web token
        const token = jwt.sign({
            id: admin.id,
            identifiant: admin.identifiant
        }, process.env.JWT_SECRET, {expiresIn: "24h"})

        // Success response
        return res.status(200).json({data: {access_token : token}, message: "Admin logged", type: "Success"})
    }
    catch (err) {
        return res.status(500).json({data: [], message: 'Database error', error: err.message, stack: err.stack, type: "Failed"})
    }
}