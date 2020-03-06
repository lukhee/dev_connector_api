const express = require('express')
const userRoute = require('./routes/userRoute')
const profileRoute = require('./routes/profileRoute')
const postRoute = require('./routes/postRoute')
const authRoute = require('./routes/authRoute')
const connectDB = require('./config/db')
const { check, validationResult } = require('express-validator');

const app = express()

// Connect Database
connectDB()

// Init Middleware
app.use(express.json({extended: false}))

// Defined Routes
app.use('/user', userRoute)
app.use('/profile', profileRoute)
app.use('/post', postRoute)
app.use('/auth', authRoute)
app.use('*', (req, res, next)=> {
    res.status(500).json({msg: "Page not found"})
})

const PORT = process.env.PORT || 5000

app.listen(PORT, ()=> console.log(`app listen at port ${PORT}`))