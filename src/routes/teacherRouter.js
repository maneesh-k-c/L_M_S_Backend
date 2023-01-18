const express = require('express');
const multer = require('multer')
const path = require('path')
const bcrypt = require('bcrypt');
const login_tb = require('../models/login_tb');
const teacherRegister = require('../models/teacherRegister');

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



teacherRouter.post('/register', upload.single("cv"), async (req, res) => {
    console.log(req.body);

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
            const login = await login_tb.create({ email, password: hashValue,role,status})
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
                    cv: req.file.filename                    
                })
                console.log(req);
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

teacherRouter.post('/teacher-view', checkAuth, async (req, res) => {
    const TeacherDetails = await login_tb.findOne({ loginId: req.userdata._id })
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






module.exports = teacherRouter