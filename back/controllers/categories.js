const db = require('../models')
const Categories = db.categories
const Product = db.product
const {Sequelize} = require('sequelize')


// GET CATEGORIES //
exports.getCategoriesNames = async (req, res) => {
    try {
        // Get categories with product count
        const categ = await Categories.findAll({
            attributes: [
                'id',
                'name',
                'createdAt',
                [Sequelize.fn('COUNT', Sequelize.col('products.id')), 'productCount'] // Fix: Use correct alias 'products'
            ],
            include: [
                {
                    model: Product,  // Join with the Product model
                    attributes: [],  // Don't fetch product details, only count them
                }
            ],
            group: ['categories.id'] // Group by category ID to count properly
        });
        
        // Check if categories exist
        if (categ.length === 0) {
            return res.status(404).json({ data: [], message: "Aucune categorie dans la liste", type: "Failed" });
        }

        // Success response
        return res.status(200).json({ data: categ, message: "Categories obtained", type: "Success" });
    } 
    catch (err) {
        return res.status(500).json({ data: [], message: 'Database error', error: err.message, stack: err.stack, type: "Failed" });
    }
};

// CREATE CATEGORY //
exports.createCategory = async (req, res) => {
    try {
        // Extract input
        const {category} = req.body

        // Check if category exist
        const categExist = await Categories.findOne({where: {name: category}})
        if (categExist !== null) {
            return res.status(409).json({data: [], message: 'Cette categorie exist deja', type: "Failed"})
        }

        // Create category
        await Categories.create({name: category})

        // Success response
        return res.status(201).json({data: [], message: 'Categorie cree avec success', type: "Success"})
    }
    catch (err) {
        return res.status(500).json({data: [], message: 'Database error', error: err.message, stack: err.stack, type: "Failed"})
    }
}

// DELETE CATEGORY //
exports.deleteCategory = async (req, res) => {
    try {
        // Extract category id
        const category_id = parseInt(req.params.id)

        // Check if category exists
        const category = await Categories.findOne({where: { id: category_id }});
        if (!category) {
            return res.status(404).json({ data: [], message: "This category does not exist", type: "Failed" });
        }

        // Check if category is associated with any product
        const productCount = await Product.count({where: {category_id}});
        if (productCount > 0) {
            return res.status(400).json({data: [], message: "Impossible de supprimer la categorie (cette categorie est associer a un ou a plusieurs produits)", type: "Failed"});
        }

        // Delete category
        await Categories.destroy({where: {id: category_id}, force: true});

        // Success response
        return res.status(200).json({data: [], message: "Category deleted", type: "Success"});
    } 
    catch (err) {
        return res.status(500).json({data: [], message: 'Database error', error: err.message, stack: err.stack, type: "Failed"});
    }
};
