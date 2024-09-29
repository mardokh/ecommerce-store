/**  MODULES IMPORTATION  **/
const jwt = require('jsonwebtoken')



/**  MIDDLEWARE JWT TOKEN CHECK  **/
exports.checkSessionToken = (req, res) => {

    try{
        // Extract token from request
        const token = req.body.token

        // Check JWT token validity
        jwt.verify(token, process.env.JWT_SECRET, (err, tokenDecoded) => {
            if (err) {
                return res.status(401).json({message: 'Bad token'})
            }

            // Send successfully
            return res.json({message: 'Valid token'})  
        })
    }
    catch(err) {
        return res.status(500).json({message: 'Database error !', error: err.message, stack: err.stack})
    }
}
