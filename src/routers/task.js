const express = require('express')
const taskRouter = new express.Router()
const {Task} = require('../models/task')

taskRouter.post('/tasks', async(req, res)=>{
    const taskData = req.body
    console.log(taskData);
    const task = new Task(taskData)
    try {
        await task.save()
        res.status(201).send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})
taskRouter.get('/tasks', async(req, res)=>{
    try {
        const userList = await Task.find({})
        res.status(201).send(userList)
    } catch (error) {
        res.status(401).send(error);
    }
})
taskRouter.get('/tasks/:id', async (req, res)=>{
    const taskID = req.params.id
    try {
        const task = await Task.findById(taskID)
        if(!task){
            return res.status(404).send('Bad request || Task Not Found')
        }
        res.send(task)
    } catch (error) {
        res.status(500).send('Server error')
    }
})
taskRouter.patch('/tasks/:id', async(req, res)=>{
    const taskID = req.params.id
    const UpdateParams = req.body
    const updates = Object.keys(UpdateParams)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every(update=>allowedUpdates.includes(update))
    if(!isValidOperation){
        return res.status(400).send({error: 'Invalid Updates'})
    }
    try {
        const updatedTask = await Task.findByIdAndUpdate(taskID, UpdateParams, {new: true, runValidators: true})
        if(!updatedTask){
            return res.status(404).send('BAD REQUEST || NO TASK FOUND TO UPDATE')
        }
        res.send(updatedTask)
    } catch (error) {
        res.status(400).send(error)
    }
})
taskRouter.delete('/tasks/:id', async (req, res)=>{
    const taskID = req.params.id
    try {
        const deletedTask = await Task.findByIdAndDelete(taskID)
        if(!deletedTask){
            return res.status(404).send('BAD REQUEST || NO TASK FOUND TO DELETE')
        }
        res.status(201).send(`"${deletedTask.description}" has been deleted`)
    } catch (error) {
        res.status(400).send(err)
    }
})

module.exports = {taskRouter}