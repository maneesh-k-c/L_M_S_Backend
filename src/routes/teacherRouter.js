const express = require('express');
const multer = require('multer')
const path = require('path')
const bcrypt = require('bcrypt');
const login_tb = require('../models/login_tb');
const teacherRegister = require('../models/teacherRegister');
const authCheck = require('../middleware/authCheck');

const teacherRouter = express.Router();


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../public/images'))
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage: storage })


teacherRouter.post('/upload', upload.single("cv"), function (req, res) {

    return res.status(200).json({
        message: "image uploaded"
    })

})



teacherRouter.post('/register', async (req, res) => {

    const { name,
        mobileNumber,
        whatsappNumber,
        DateOfBirth,
        gender,
        address,
        passionateTeachingDescription,
        email,
        password,
        experienceDescription,
        academicDescription,
        websiteDescription,
        tutoringTimeDescription,
        subjectExpertiseDescription,
        cv
    } = req.body
    const role = "teacher"
    const status = 0
    try {
        const hashValue = await bcrypt.hash(password, 10)
        if (!hashValue) {
            res.status(404).json({ message: "password hashing error occured...!!" })
        }
        const userValue = await login_tb.findOne({ email })
        if (userValue) {
            return res.status(404).json({ message: "user already existed...!!" })
        }
        else {
            const login = await login_tb.create({ email, password: hashValue, role, status })
            if (!login) {
                return res.status(404).json({ message: "something went wrong...!" })
            } else {
                const signup = await teacherRegister.create({
                    loginId: login._id,
                    name,
                    mobileNumber,
                    whatsappNumber,
                    DateOfBirth,
                    gender,
                    address,
                    passionateTeachingDescription,
                    experienceDescription,
                    academicDescription,
                    websiteDescription,
                    tutoringTimeDescription,
                    subjectExpertiseDescription,
                    cv
                })
                // console.log(req);
                if (!signup) {
                    return res.status(404).json({ message: "something went wrong...!" })
                } else {
                    return res.status(200).json({ message: "registerdata added successfully.." })
                }

            }

        }

    } catch (error) {
        console.log(error);
        return res.status(404).json({ ERROR: error })
    }

})

//teacher personal details view
teacherRouter.post('/teacher-view', authCheck, async (req, res) => {
    const TeacherDetails = await login_tb.findOne({ loginId: req.userdata.loginId })
    try {
        if (!TeacherDetails) {
            res.status(404).json({ message: "data is not occured" })
        } else {
            res.status(200).json({
                TeacherDetails: {
                    loginId: login._id,
                    name: TeacherDetails.name,
                    mobileNumber: TeacherDetails.mobileNumber,
                    whatsappNumber: TeacherDetails.whatsappNumber,
                    DateOfBirth: TeacherDetails.DateOfBirth,
                    gender: TeacherDetails.gender,
                    address: TeacherDetails.address,
                    passionateTeachingDescription: TeacherDetails.passionateTeachingDescription,
                    experienceDescription: TeacherDetails.experienceDescription,
                    academicDescription: TeacherDetails.academicDescription,
                    websiteDescription: TeacherDetails.websiteDescription,
                    tutoringTimeDescription: TeacherDetails.tutoringTimeDescription,
                    subjectExpertiseDescription: TeacherDetails.subjectExpertiseDescription
                }
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(404).json({ ERROR: error })
    }

})

//teacher-password update

teacherRouter.post('/password-update', authCheck, async (req, res) => {
    try {
        const TeacherData = await login_tb.findOne({ loginId: req.userData.loginId })
        console.log(req.userData);
        if (TeacherData) {
            const passwordValue = await bcrypt.compare(req.body.currentPassword, TeacherData.password)
            // console.log(TeacherData.password);
            if (passwordValue == true) {
                const newPassword = await bcrypt.hash(req.body.password, 10)
                if (!newPassword) {
                    return res.status(404).json({ message: "password hashing error....." })
                } else {
                    const passwordUpdated = await login_tb.updateOne({ loginId: req.userData.loginId }, { $set: {password:newPassword} })
                    if (passwordUpdated) {
                        return res.status(200).json({
                            message: "password updated..."
                        })
                    } else {
                        return res.status(400).json({
                            message: "get lost.."
                        })
                    }
                }

            } else {
                return res.status(400).json({
                    message: "password doesnt match..."
                })
            }
        }
    } catch (error) {
        console.log(error);
        return res.status(404).json({ ERROR: error })
    }
})


module.exports = teacherRouter