// MODULES IMPORTS //
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
require('dotenv').config()

// ROUTES IMPORTS //
const Shopping = require('./routes/shoppingCart')
const Products = require('./routes/products')
const Recipes = require('./routes/recipes')
const FavoritesProducts = require('./routes/favoriteProducts')
const FavoritesRecipes = require('./routes/favoriteRecipes')
const ProductsNotesComments = require('./routes/productsNotesComments')
const RecipesNotesComments = require('./routes/recipesNotesComments')
const Admin = require('./routes/admin')
const User = require('./routes/user')
const SearchBar = require('./routes/searchBar')
const JwtSession = require('./routes/check_jwt_session')


// IMPORT DATABASE CONNECTER //
const DB = require('./db.config')


// EXPRESS SERVER INITIALISATION //
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())


// CORS POLICY //
app.use(cors({
  origin: `http://${process.env.REMOTE_ADDR}:${process.env.CLIENT_PORT}`,
  credentials: true
}))


// CORS POLICY ALL ORIGIN //
/*
app.use(cors({
  credentials: true
}))
*/

// STATICS FILES //
app.use('/uploads', express.static('uploads'))


// ROUTES //
app.get('/', (req, res) => res.send('Welcom you are connected'))
app.use('/shopping', Shopping)
app.use('/products', Products)
app.use('/recipes', Recipes)
app.use('/favorites/products', FavoritesProducts)
app.use('/favorites/recipes', FavoritesRecipes)
app.use('/reviews/products', ProductsNotesComments)
app.use('/reviews/recipes', RecipesNotesComments)
app.use('/search', SearchBar)
app.use('/admin', Admin)
app.use('/user', User)
app.use('/session', JwtSession)
app.get('*', (req, res) => res.status(404).send('404 not found !'))


// STARTING API SERVER AND DATABASE //
DB.sequelize.authenticate()
.then(() => console.log('Database connected sucessfully'))
.then(() => {
  app.listen(process.env.SERVER_PORT, () => { 
    console.log('api server is starting')
  })
})
.catch(err => console.log('Error to database connect !', err))