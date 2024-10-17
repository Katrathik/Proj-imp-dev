const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose) // same in docs

const noteSchema = new mongoose.Schema(
    {
    user:{
        // here we tell type is an objectId from a schema that is referred to
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        // here we tell specifically which Schema we want to refer to
        ref:'User'
    },
    title:{
        type:String,
        required:true
    },
    
    text:{
        type:String,
        required:true
    },
    completed:{
        type:Boolean,
        default:false // as a new note created will be open and not completed
    } 
   
    },
    {
        timestamps:true
    }

)
// once w start creating notes , thsi plugin will create a sepearte collection called counter
// which tracks the seq number and continues to insert it into our notes
noteSchema.plugin(AutoIncrement,{
    // this creates a ticket filed inside noteSchema which will inc sequentially where each gets a seq number
    inc_field:'ticket',
    id:'ticketNums', // we will see this in a seperate collection created called counter
    start_seq:500
})

module.exports = mongoose.model('Note',noteSchema)