const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://jdjithin:maitexa2255@cluster0.me79b0j.mongodb.net/test_db?retryWrites=true&w=majority')
const schema = mongoose.Schema
const loginSchema = new schema({
    role:{type: String, required: true},
    email: { type: String },
    password: { type: String }
})
const login_tb = mongoose.model('login_tb', loginSchema)
module.exports = login_tb