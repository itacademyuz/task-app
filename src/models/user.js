const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const mongooseLeanVirtuals = require('mongoose-lean-virtuals')
const { Task } = require('./task')
const opts = {
    toJSON:{virtuals:true},
    timestamps: true
}
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
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
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar:{
        type: Buffer
    }
}, opts)
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})
//  userSchema.plugin(mongooseLeanVirtuals)
//Methods
userSchema.methods.toJSON =function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    return userObject
}
userSchema.methods.generateAuthToken = async function(){
    const user = this
    const token = jwt.sign({_id: user._id.toString()}, 'asecretkey')
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}
userSchema.statics.findByCredentials = async (credentials)=>{
    const user = await User.findOne({email: credentials.email})
    if(!user){
        throw new Error('UNABLE TO LOG IN || NO USER FOUND BASED ON INFORMATION GIVEN')
    }
    const isMatch = await bcrypt.compare(credentials.password, user.password)
    if(!isMatch){
        throw new Error('UNABLE TO LOG IN || WRONG PASSWORD')
    }
    return user
}

userSchema.pre('save', async function (next) {
    const user = this
    
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})
userSchema.pre('remove', async function(next){
    const user = this
    await Task.deleteMany({owner: user._id})
    next()
})
const User = mongoose.model('User', userSchema)
module.exports = {User}