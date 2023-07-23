const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const { match } = require('assert')

const Schema = mongoose.Schema

const userSchema = new Schema ({
    Email: {
        type: String,
        required: true,
        unique: true,
    },
    Password: {
        type: String,
        required: true,
        minlength: 8
    }
}, {timestamps: true})

userSchema.statics.signup = async function (Email, Password) {

    if(!Email || !Password) {
        throw Error('All fields must be filled.')
    }

    if(!validator.isEmail(Email)) {
        throw Error('Email is not valid.')
    }

    if(!validator.isStrongPassword(Password)) {
        throw Error('Password is not strong enough.')
    }

    const exists = await this.findOne({Email})

    if(exists) {
        throw Error('Email is already in use.')
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(Password, salt)

    const user = await this.create({ Email, Password: hash})

    return user
}

userSchema.statics.login = async function (Email, Password) {

    if(!Email || !Password) {
        throw Error('All fields must be filled.')
    }

    const user = await this.findOne({Email})

    if(!user){
        throw Error('Incorrect Email')
    }

    const match = await bcrypt.compare(Password, user.Password)

    if(!match) {
        throw Error('Incoorect Password, please provide valid credentials.')
    }

    return user
}

module.exports = mongoose.model('user', userSchema)