// MODULES IMPORT //
const DB = require('../db.config')
//const Recipe = DB.recipe
const Product = DB.product
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

        // Send data 
        return res.json({data: products})

    }
    catch (err) {
        return res.status(500).json({message: 'Database error !', error: err.message, stack: err.stack})
    }
}

