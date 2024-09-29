// MODULES IMPORTATION //
const {Sequelize} = require('sequelize')


//  CONNECT TO DATABASSE  //
let sequelize = new Sequelize (
    process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
        host: process.env.HOST_NAME,
        dialect: 'mysql',
        logging: false
    }
)

// MODELS IMPORTATION //
const db = {}
db.sequelize = sequelize
db.shoppingCart = require('./models/shoppingCart')(sequelize)
db.product = require('./models/product')(sequelize)
db.favoriteProduct = require('./models/favoriteProduct')(sequelize)
db.productImages = require('./models/productImages')(sequelize)
db.recipe = require('./models/recipe')(sequelize)
db.favoriteRecipe = require('./models/favoriteRecipe')(sequelize)
db.admin = require('./models/admin')(sequelize)
db.users = require('./models/users')(sequelize)
db.productsNotesComments = require('./models/productsNotesComments')(sequelize)
db.productsNotesLevels = require('./models/productsNotesLevels')(sequelize)
db.recipesNotesComments = require('./models/recipesNotesComments')(sequelize)
db.recipesNotesLevels = require('./models/recipesNotesLevels')(sequelize)


// tables associations : shoppingCarts - products
db.shoppingCart.belongsTo(product, { foreignKey: 'product_id', as: 'shopping_cart_product', onDelete: 'CASCADE' })
db.product.hasMany(shoppingCart, { foreignKey: 'product_id', onDelete: 'SET NULL' })

// tables associations : favoriteProducts - products
db.favoriteProduct.belongsTo(product, { foreignKey: 'product_id', as: 'favorite_product', onDelete: 'CASCADE' })
db.product.hasOne(favoriteProduct, { foreignKey: 'product_id', onDelete: 'SET NULL' })

// table associations : productImages - products
db.productImages.belongsTo(product, { foreignKey: 'productId', onDelete: 'CASCADE' })
db.product.hasMany(productImages, { foreignKey: 'productId', as: 'product_images', onDelete: 'SET NULL' })

// tables associations : favoriteRecipes - recipes
db.favoriteRecipe.belongsTo(recipe, { foreignKey: 'recipe_id', as: 'favorite_recipe', onDelete: 'CASCADE' })
db.recipe.hasOne(favoriteRecipe, { foreignKey: 'recipe_id', onDelete: 'SET NULL' })

// tables associations : productsNotesComments - users
db.productsNotesComments.belongsTo(users, { foreignKey: 'user_id', as: 'user_profil', onDelete: 'CASCADE' })
db.users.hasOne(productsNotesComments, { foreignKey: 'user_id', onDelete: 'SET NULL'})

// tables associations : recipesNotesComments - users
db.recipesNotesComments.belongsTo(users, { foreignKey: 'user_id', as: 'user_profil', onDelete: 'CASCADE' })
db.users.hasOne(recipesNotesComments, { foreignKey: 'user_id', onDelete: 'SET NULL'})

// synchronizate models
db.sequelize.sync({ alter: true, force: false })


// EXPORTING  //
module.exports = db