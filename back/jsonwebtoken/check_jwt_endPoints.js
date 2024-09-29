/**  MODULES IMPORTATION  **/
const jwt = require('jsonwebtoken')


/**  EXTRACT JWT TOKEN  **/
const extractBearer = authorization => {

    try{
        // Check type
        if (typeof authorization !== "string") {
            return false
        }

        // Extract
        const matches = authorization.match(/(bearer)\s+(\S+)/i)

        // Return boolean
        return matches && matches[2]
    }
    catch(err) {
        return console.log(err)
    }
}

/**  MIDDLEWARE JWT TOKEN CHECK  **/
const checkTokenMIddleware = (req, res, next) => {

    try{
        // Check if JWT token exist and have valide format 
        const token = req.headers.authorization && extractBearer(req.headers.authorization)
        if (!token) {
            return res.status(401).json({message: 'Token not found or bad format !'}) 
        }

        // Check JWT token validity
        jwt.verify(token, process.env.JWT_SECRET, (err, tokenDecoded) => {
            if (err) {
                return res.status(401).json({message: 'Bad token !'})
            }
            // Execute next code
            next()
        })
    }
    catch(err) {
        return res.status(500).json({message: 'Database error !', error: err.message, stack: err.stack})
    }
}

module.exports = checkTokenMIddleware