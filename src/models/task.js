
const mongoose = require('mongoose')

const opts = {
    timestamps: true
}
const taskSchema = mongoose.Schema({
    description:{
        type: String,
        required: true,
        trim: true
    },
    completed:{
        type: Boolean,
        default: false
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, opts)
const Task = mongoose.model('Task', taskSchema)


module.exports = {Task}