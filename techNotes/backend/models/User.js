const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    // array indicates a user may have more than 1 role and more than 1 value can be stored in the array
    roles:[{
        type:String,
        default:"Employee"
    }],
    active:{
        type:Boolean,
        // means an employee must be active immediately on creation
        default:true
    }
   
})

module.exports = mongoose.model('User',userSchema)