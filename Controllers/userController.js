const { default: mongoose } = require('mongoose')
const jwt = require('jsonwebtoken')

const User = require('../Models/userSchema')

const createToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRET, {expiresIn: '3d'})
}

const loginUser = async (req,res) => {
    const {Email, Password} = req.body 

    try{
        const user = await User.login(Email, Password)

        const token = createToken(user._id)

        res.status(200).json({Email, token})
    }
    catch(error) {
        res.status(400).json({error: error.message})
    }
}


const signupUser = async (req,res) => {
    const {Email, Password} = req.body

    try{
        const user = await User.signup(Email, Password)
        
        // create a token

        const token = createToken(user._id)
        
        res.status(200).json({Email, token})

    } catch(error) {
        res.status(400).json({error: error.message})
    }
}

module.exports = {
    loginUser,
    signupUser
}