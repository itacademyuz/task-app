const mongoose = require('mongoose')

const dbURL = 'mongodb://127.0.0.1:27017'
mongoose.connect(dbURL+'/task-manager-api', {
    useNewUrlParser: true
})
