const express = require('express')
const login_tb = require('../models/login_tb')
const loginRouter = express.Router()
const jwt = require('jsonwebtoken')
const bcrypt=require('bcrypt')


loginRouter.post('/', async (req, res) => {

    const {  email, password } = req.body

    const loginDetails = await login_tb.findOne({ email })
    // console.log(loginDetails.role);
    if (!loginDetails) {
        res.status(400).json({
            message: "Email doesn't exists"
        })
    } else {
        const hashed = await bcrypt.compare(password, loginDetails.password)
        if (hashed == true) {
            const token = jwt.sign({ loginId: loginDetails._id }, 'secret_007', { expiresIn: "1h" })

            return res.status(200).json({
                message: "Login successful",
                success: true,
                error: false,
                token: token,
                role:loginDetails.role
            })
        } else {
            res.status(404).json({
                message: "password error",
                success: false,
                error: true
            })
        }
    }
})

module.exports=loginRouter