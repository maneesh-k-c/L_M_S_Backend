const jwt = require("jsonwebtoken")

module.exports = async (req, res, next) => {
    try {
        //getting token from authorization
        const token = await req.headers.authorization.split(" ")[1]
        //decoding token
        const decodedToken =  jwt.verify(token, 'secret_007')

        req.userData = { loginId: decodedToken.loginId }
        next()

    } catch (error) {
        res.status(401).json({
            message: "Authentication failed !!! please login"
        })
    }
}