const express = require('express')
const userRouter = new express.Router()
const {User} = require('../models/user')

userRouter.post('/users', async(req, res)=>{
    const userData = req.body
    console.log(userData);
     const user = new User(userData)
    try {
        await user.save()
        res.status(201).send(user)
    } catch (error) {
        res.status(401).send(error)
    }
})

userRouter.get('/users', async (req, res)=>{
    try{
        const userList = await User.find({})
        res.status(201).send(userList)
    }catch(err){
        res.send(err)
    }
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
        const updatedUser = await User.findByIdAndUpdate(userID, UpdateParams, {new: true, runValidators:true})
        if(!updatedUser){
            return res.status(404).send('BAD REQUEST || NO USER FOUND TO UPDATE')
        }
        res.send(updatedUser)
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