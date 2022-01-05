const express = require('express')
const userRouter = new express.Router()
const {User} = require('../models/user')
const {auth} = require('../middleware/auth')

userRouter.post('/users', async(req, res)=>{
    const userData = req.body
    console.log(userData);
     const user = new User(userData)
    try {
        const token = await user.generateAuthToken()
        await user.save()
        res.status(200).send({user, token}) 
    } catch (error) {
        res.status(401).send(error)
    }
})

userRouter.post('/users/login', async (req, res)=>{
    const credentials = req.body
    try {
        const user = await User.findByCredentials(credentials)
        const token = await user.generateAuthToken()
        res.status(200).send({user, token})            
    } catch (e) {
        res.status(404).send(e)
    }
})

userRouter.post('/users/logout', auth, async(req, res)=>{
     try {
         req.user.tokens = req.user.tokens.filter(token=>{
             return token.token !== req.token
         }) 
         await req.user.save()
         res.send('Successfully logged out')
     } catch (e) {
         res.status(500).send(e)
     }
})

userRouter.post('/users/terminateAll', auth, async(req, res)=>{
    try {
        req.user.tokens = []
        await req.user.save()
        res.send('All sessions have been terminated')
    } catch (e) {
        res.status(500).send(e)
    }
})

userRouter.get('/users/me', auth, async (req, res)=>{
    res.send(req.user)
})

userRouter.get('/users/:id', async (req, res)=>{
    const userID = req.params.id
    try {
        const user = await User.findById(userID)
        if(!user){
            return res.status(404).send('Bad request || User Not Found')
        }
        res.send(user)
    } catch (error) {
        res.status(500).send(error)
    }
})
userRouter.patch('/users/:id', async(req, res)=>{
    const userID = req.params.id
    const UpdateParams = req.body
    const updates = Object.keys(UpdateParams)
    const allowedUpdates = ["name", "email", "password", "age"]
    const isValidOperation = updates.every((update)=> allowedUpdates.includes(update))
    if(!isValidOperation){
        return res.status(400).send({error: 'Invalid Updates!'})
    }
    try {
        const user = await User.findById(userID)
        if(!user){
            return res.status(404).send('BAD REQUEST || NO USER FOUND TO UPDATE')
        }
        updates.forEach(update => user[update] = UpdateParams[update]);
        //const updatedUser = await User.findByIdAndUpdate(userID, UpdateParams, {new: true, runValidators:true})
        await user.save()
        
        res.send(user)
    } catch (error) {
        res.status(400).send(error)
    }
})

userRouter.delete('/users/:id', async (req, res)=>{
    const userID = req.params.id
    try {
        const deletedUser = await User.findByIdAndDelete(userID)
        if(!deletedUser){
            return res.status(404).send('BAD REQUEST || NO USER FOUND TO DELETE')
        }
        res.status(201).send(`${deletedUser.name} has been deleted`)
    } catch (error) {
        res.status(400).send(err)
    }
})

module.exports = {userRouter}