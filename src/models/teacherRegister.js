const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://jdjithin:maitexa2255@cluster0.me79b0j.mongodb.net/test_db?retryWrites=true&w=majority')

const Schema = mongoose.Schema

const signupSchema =  {
login_id:{type:Schema.Types.ObjectId,ref:"login_tb"},
name:{type:String},
mobileNumber:{type:String},
whatsappNumber:{type:String},
DateOfBirth: { type: String },
gender:{type:String},
address:{type:String},
passionateTeachingDescription:{type:String},
cv:{type:String},
experienceDescription:{type:String},
academicDescription:{type:String},
websiteDescription:{type:String},
tutoringTimeDescription:{type:String},
subjectExpertiseDescription:{type:String},
}

const teacherRegister = mongoose.model("teacherRegister",signupSchema)
module.exports = teacherRegister