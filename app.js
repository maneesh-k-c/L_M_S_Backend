const express = require ('express')
const loginRouter = require('./src/routes/loginRouter')
const parentRouter = require('./src/routes/parentRouter')
const studentRouter = require('./src/routes/studentRouter')
const teacherRouter = require('./src/routes/teacherRouter')
const app=express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static('/public'))

// const bodyParser = require('body-parser')
// app.use(bodyParser.urlencoded({ extended: true }))
// app.use(bodyParser.json())

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header("Access-Control-Allow-Headers", "x-access-token, Origin, X-Requested-With, Content-Type, Accept,Authorization");
    next();
});


app.use('/api/login',loginRouter)
app.use('/api/parent',parentRouter)
app.use('/api/student',studentRouter)
app.use('/api/teacher',teacherRouter)

app.listen(3001,()=>{
    console.log("server started at port 3001");
})