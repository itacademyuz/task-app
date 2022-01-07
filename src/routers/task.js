const express = require('express')
const taskRouter = new express.Router()
const {Task} = require('../models/task')
const {auth} = require('../middleware/auth')
taskRouter.post('/tasks', auth, async(req, res)=>{
    const taskData = req.body 
    const task = new Task({
        ...taskData,
        owner: req.user._id
    })
    try {
        await task.save()
        res.status(201).send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})
taskRouter.get('/tasks', auth, async(req, res)=>{
    try {
        const taskList = await Task.find({owner:req.user._id})
        res.status(201).send(taskList)
    } catch (error) {
        res.status(401).send(error);
    }
})
taskRouter.get('/tasks/:id', auth, async (req, res)=>{
    const taskID = req.params.id
    const user = req.user
    try {
        const task = await Task.findOne({_id: taskID, owner:user._id})
        if(!task){
            return res.status(404).send('Bad request || Task Not Found')
        }
        res.send(task)
    } catch (error) {
        console.log(error);
        res.status(500).send('Server error')
    }
})
taskRouter.patch('/tasks/:id', auth, async(req, res)=>{
    const taskID = req.params.id
    const UpdateParams = req.body
    const updates = Object.keys(UpdateParams)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every(update=>allowedUpdates.includes(update))
    const user = req.user
    if(!isValidOperation){
        return res.status(400).send({error: 'Invalid Updates'})
    }
    try {
        const updatedTask = await Task.findOne({_id: taskID, owner: user._id})
        
        if(!updatedTask){
            return res.status(404).send('BAD REQUEST || NO TASK FOUND TO UPDATE')
        }
        updates.forEach(update => updatedTask[update] = UpdateParams[update]);
        await updatedTask.save()
        res.send(updatedTask)
    } catch (error) {
        res.status(400).send(error)
    }
})
taskRouter.delete('/tasks/:id', auth, async (req, res)=>{
    const taskID = req.params.id
    const userID = req.user._id
    try {
        const deletedTask = await Task.findOne({_id:taskID, owner: userID})
        if(!deletedTask){
            return res.status(404).send('BAD REQUEST || NO TASK FOUND TO DELETE')
        }
        await deletedTask.delete()
        res.status(201).send(`"${deletedTask.description}" has been deleted`)
    } catch (error) {
        res.status(400).send(err)
    }
})

module.exports = {taskRouter}