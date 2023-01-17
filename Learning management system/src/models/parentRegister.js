const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://jdjithin:maitexa2255@cluster0.me79b0j.mongodb.net/test_db?retryWrites=true&w=majority')
const schema = mongoose.Schema
const parentSchema = new schema({
    loginId: { type: schema.Types.ObjectId, ref: "login_tb" },   //foreign id from login
    name: { type: String },
    mobileNumber: { type: String },
    studentName: { type: String },
    dob: { type: String },
    nationality: { type: String },
    countryOfResidence: { type: String },
    curriculam: { type: String },
    grade: { type: String },
    courses: { type: String },
    timeSlot: { type: String }
})
const parentRegister = mongoose.model('parentRegister', parentSchema)
module.exports = parentRegister