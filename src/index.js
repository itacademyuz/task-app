const express = require('express')
require('./db/mongoose')
const {userRouter} = require('./routers/user')
const {taskRouter} = require('./routers/task')
const app = express()
const PORT = process.env.PORT
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)
app.get('/', async (req, res)=>{
    res.send({message: 'Please use postman to utilize this app'})
})
app.listen(PORT, ()=>{
    console.log(`Server is app and running at port ${PORT}`);
})
