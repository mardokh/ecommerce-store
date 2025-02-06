// MODULES IMPORTS //
const db = require('../models')
const Admin = db.admin
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


// ADD ADMIN //
exports.createAdmin = async (req, res) => {
    try {
        // Extract inputs
        const {lastName, firstName, email, password} = req.body

        // Check if admin exist
        const admin = await Admin.findOne({where: {email}})
        if (admin !== null) {
            return res.status(409).json({data: [], message: 'This admin already exist', type: "Failed"})
        }

        // Password hash
        const hashedPass = await bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT))

        // Create admin
        await Admin.create({lastName, firstName, email, password: hashedPass})

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
        const {email, password} = req.body

        // Check if admin match
        const admin = await Admin.findOne({where: {email}})
        if (admin === null) {
            return res.status(401).json({data: [], message: 'Mot de passe ou identifiant incorrect', type: "Failed"})
        }

        // Check if password match
        const passe = await bcrypt.compare(password, admin.password)
        if (!passe) {
            return res.status(401).json({data: [], message: 'Mot de passe ou identifiant incorrect', type: "Failed"})
        }

        // Generate json web token
        const token = jwt.sign({
            id: admin.id,
            email: admin.email
        }, process.env.JWT_SECRET, {expiresIn: "24h"})

        // Success response
        return res.status(200).json({data: {access_token : token}, message: "Admin logged", type: "Success"})
    }
    catch (err) {
        return res.status(500).json({data: [], message: 'Database error', error: err.message, stack: err.stack, type: "Failed"})
    }
}