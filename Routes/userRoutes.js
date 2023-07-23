const express = require('express')

const { 
    loginUser,
    signupUser
} = require('../Controllers/userController')
const router = express.Router()

// login route 
router.post('/login', loginUser)

router.post('/signup', signupUser)

module.exports = router

