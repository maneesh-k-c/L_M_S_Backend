const express = require('express')
const login_tb = require('../models/login_tb')
const studentRegister = require('../models/studentRegister')
const studentRegisterRouter = express.Router()
const bcrypt = require('bcrypt')

studentRegisterRouter.post('/register', async (req, res) => {
    const {
        name, parentName,
        mobileNumber, dob,
        nationality, countryOfResidence,
        curriculam, grade, courses, timeSlot, email, password
    } = req.body
    console.log(req.body);
    const role = "student"
    const status = 0
    try {
        const hashed = await bcrypt.hash(password, 10)

        if (!hashed) {
            return res.status(404).json({ message: "password hashing error" })
        } else {

            const oldUser = await login_tb.findOne({ email })
            if (oldUser) {
                return res.status(404).json({ message: "user already exists" })
            } else {
                const login = await login_tb.create({ email, password: hashed, role })
                if (!login) {
                    return res.status(404).json({ message: "something went wrong" })
                } else {
                    const register = await studentRegister.create({
                        loginId: login._id,
                        name, parentName,
                        mobileNumber, dob,
                        nationality, countryOfResidence,
                        curriculam, grade, courses, timeSlot
                    })
                    if (!register) {
                        return res.status(404).json({
                            message: "something went wrong"
                        })
                    } else {
                        return res.status(200).json({
                            message: "student register data added successfully"
                        })
                    }

                }
            }
        }

    } catch (error) {
        console.log(error);
        return res.status(404).json({
            ERROR: error
        })
    }

})

module.exports = studentRegisterRouter