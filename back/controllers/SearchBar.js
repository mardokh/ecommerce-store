// MODULES IMPORT //
const db = require('../models')
//const Recipe = db.recipe
const Product = db.product
const Sequelize = require('sequelize')


// GET OBJECTS SEARCHED //
exports.searchBar = async (req, res) => {

    try {
        // Get term searched from query
        const searchTerm = req.query.q

        // Search in products table
        const products = await Product.findAll({
            where: {
                [Sequelize.Op.or]: [
                    {
                        name: {
                            [Sequelize.Op.like]: `%${searchTerm}%`,
                        },
                    },
                    {
                        details: {
                            [Sequelize.Op.like]: `%${searchTerm}%`,
                        },
                    },
                ],
            },
        })

        // Check if article exist
        if (products.length === 0) {
            return res.status(404).json({data: [], message: "Aucun resulta", type: "Failed"})
        }

        // Send data 
        return res.status(200).json({data: products, message: "Search obtained", type: "Success"})

    }
    catch (err) {
        return res.status(500).json({data: [], message: 'Database error', error: err.message, stack: err.stack, type: "Failed"})
    }
}

