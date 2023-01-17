const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://jdjithin:maitexa2255@cluster0.me79b0j.mongodb.net/test_db?retryWrites=true&w=majority')
const schema = mongoose.Schema
const studentSchema = new schema({
    loginId: { type: schema.Types.ObjectId, ref: "login_tb" },   //foreign id from login
    name: { type: String },
    parentName:{ type: String},
    mobileNumber:{ type: String},
    dob:{ type: String},
    nationality:{ type: String},
    countryOfResidence:{ type: String},
    curriculam:{ type: String},
    grade:{ type: String},
    courses:{ type: String},
    timeSlot:{ type: String}
})
const studentRegister=mongoose.model('studentRegister',studentSchema)
module.exports=studentRegister