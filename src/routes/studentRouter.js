const express = require('express')
const login_tb = require('../models/login_tb')
const studentRegister = require('../models/studentRegister')
const studentRouter = express.Router()
const bcrypt = require('bcrypt')
const authCheck = require('../middleware/authCheck')

//student register api
studentRouter.post('/register', async (req, res) => {
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
                            message: "student register data added successfully",
                            success: true,
                            error: false
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

//students profile view api

studentRouter.post('/view', authCheck, async (req, res) => {

    try {
        const profInfo = await studentRegister.findOne({ loginId: req.userData.loginId })
        if (profInfo) {
            res.status(200).json({
                name: profInfo.name,
                parentName: profInfo.parentName,
                mobileNumber: profInfo.mobileNumber,
                dob: profInfo.dob,
                nationality: profInfo.nationality,
                countryOfResidence: profInfo.countryOfResidence,
                curriculam: profInfo.curriculam,
                grade: profInfo.grade
            })
        } else {
            res.status(404).json({
                message: "Something went wrong!!!"
            })
        }
    } catch (error) {
        res.status(404).json({
            Error: error
        })
    }
})

//students profile update api
studentRouter.post('/update', authCheck, async (req, res) => {
    try {
        const profInfo = await studentRegister.findOne({ loginId: req.userData.loginId })
        if (profInfo) {

            const profData = {
                loginId: req.userData.loginId,
                name: req.body.name,
                parentName: req.body.parentName,
                mobileNumber: req.body.mobileNumber,
                dob: req.body.dob,
                nationality: req.body.nationality,
                countryOfResidence: req.body.countryOfResidence,
                curriculam: req.body.curriculam,
                grade: req.body.grade
            }

            const updateProf = await studentRegister.updateOne({ loginId: req.userData.loginId }, { $set: profData })
            if (updateProf) {
                return res.status(200).json({
                    message: "student profile data updated successfully",
                    success: true,
                    error: false
                })
            } else {
                res.status(404).json({
                    message: "Something went wrong in updation!!!",
                    success: false,
                    error: true
                })
            }
        } else {
            res.status(404).json({
                message: "Something went wrong!!!"
            })
        }
    } catch (error) {
        res.status(404).json({
            Error: error
        })
    }
})

//student password update api
studentRouter.post('/password-update', authCheck, async (req, res) => {
    try {
        const profInfo = await login_tb.findOne({ loginId: req.userData.loginId })
        if (profInfo) {
            const passCheck = await bcrypt.compare( password= req.body.currentPassword , profInfo.password)
            if (passCheck == true) {
                const hashed=await bcrypt.hash(password=req.body.password,10)
                if (!hashed) {
                    return res.status(404).json({ message: "password hashing error" }) 
                } else {
                    const passUpd={
                        email:profInfo.email,
                        role:profInfo.role,
                        password:hashed
                    }
                    const passwordUpdate=await login_tb.updateOne({loginId: req.userData.loginId},{$set:passUpd})
                    if (passwordUpdate) {
                        res.status(200).json({
                            message:"password updated successfully"
                        })
                    } else {
                        res.status(404).json({
                            message:"password not updated!!!"
                        })
                    }
                }               

            } else {
                res.status(404).json({
                    message:"Entered current password is wrong!!!"
                })
            }
        }
    } catch (error) {
        console.log(error);
        res.status(404).json({
            Error: error
        })
    }
})

module.exports = studentRouter