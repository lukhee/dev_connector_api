const express = require('express')
const userRoute = require('./routes/userRoute')
const profileRoute = require('./routes/profileRoute')
const postRoute = require('./routes/postRoute')
const authRoute = require('./routes/authRoute')
const connectDB = require('./config/db')
const bodyParser = require('body-parser')
const cors = require('cors')
const { check, validationResult } = require('express-validator');

const app = express()

// Connect Database
connectDB()

// Init Middleware
app.use(cors())
// app.use(express.json({extended: false}))
//body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Defined Routes
app.use('/api/user', userRoute)
app.use('/api/profile', profileRoute)
app.use('/api/post', postRoute)
app.use('/api/auth', authRoute)
app.use('*', (req, res, next)=> {
    res.status(500).json({msg: "Page not found"})
})

const PORT = process.env.PORT || 5000

app.listen(PORT, ()=> console.log(`app listen at port ${PORT}`))