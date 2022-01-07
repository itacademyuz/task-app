const express = require('express')
require('./db/mongoose')
const {userRouter} = require('./routers/user')
const {taskRouter} = require('./routers/task')
const app = express()
const PORT = process.env.PORT||3000


app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(PORT, ()=>{
    console.log(`Server is app and running at port ${PORT}`);
})

const {Task} = require('./models/task')
const { User } = require('./models/user')

const main = async() =>{
    // const task = await Task.findById('61d8bfa41d9904ccfa878aad')
    // await task.populate('owner')
    // console.log(task);
    
}

main()