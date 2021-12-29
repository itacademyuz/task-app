const mongoose = require('mongoose')
const validator = require('validator')

const User = mongoose.model('User', {
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate: (email)=>{
            if(!validator.isEmail(email)){
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate: (passWord)=>{
            if(passWord.toLowerCase().includes('password')){
                throw new Error('Invalid password')
            }
        }
    },
    age:{
        type: Number,
        default: 18,
        validate: (value)=>{
            if(value<18){
                throw new Error('Age must be greater than 18')
            }
        }
    }
})


module.exports = {User}