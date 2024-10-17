const User = require('../models/User')
const Note = require('../models/Note')
 // keep us from using so many try catch blocks as we use async methods for crud operations in mongoDB with mongoose
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

// @access Private is done via authorization of roles

// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = asyncHandler(async (req, res) => {
    // find user and do not send password with the rest of the data to client
    // lean() will tell mongoose to give json data without extras
    
    // get all users from db 
    const users = await User.find().select('-password').lean()

    // check users array has no data,return 400 
    if(!users?.length){
        // if this return not here, it may give an error of client headers aldready set
        // better than adding return at end of func which may cause problems
        return res.status(400).json({message: 'No users found'})
    }

    // if users, send them
    res.json(users)
})

// @desc Create new user
// @route POST /users
// @access Private
const createNewUser = asyncHandler(async (req, res) => {
    // get data from client by destructuring req.body
    const { username, password,roles } = req.body

    // confirm data
    // if no username or password, or roles is not an array, or roles array is empty
    // if other kinds of errors, our express errorHandler catches them and our 404 page comes in
    if(!username || !password ||!Array.isArray(roles) || !roles.length){
        return res.status(400).json({message: 'All fields are required'})
    }

    // check for duplicate
    const duplicate = await User.findOne({username}).collation({locale:'en',strength:2}).lean().exec()

    if(duplicate){
        // 409 conflict
        return res.status(409).json({message: 'Duplicate username'})
    }

    // hash password 
    const hashedPwd = await bcrypt.hash(password, 10) // 10 is salt rounds

    // create an object userObject with username and hashed password and roles
    const userObject = { username, "password": hashedPwd, roles }

    // create and store new user in db
    const user = await User.create(userObject)

    if(user) // created
    {
        return res.status(201).json({message: `new user ${username} created`})
    }
    else{
        return res.status(400).json({message: 'Invalid user data received'})
    }
})

// @desc Update a user
// @route PATCH /users
// @access Private
const updateUser = asyncHandler(async (req, res) => {
    const { id,username,roles,active,password } = req.body

    // confirm data as in createNewUser
    if(!id || !username || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean'){
        return res.status(400).json({message: 'All fields are required'})
    }

    //here we will not use lean() as we want to persist changes in db using save() as we cannot use save() when lean() is used
    const user = await User.findById(id).exec()

    
    if(!user){
        return res.status(400).json({message: 'User not found'})
    }

    // check for duplicate
    const duplicate = await User.findOne({username}).collation({locale:'en',strength:2}).lean().exec()

    // Allow updates to the original user
    // below line means that u cannot take an aldready existing name for an update
    if(duplicate && duplicate?._id.toString() !== id){
        return res.status(409).json({message: 'Duplicate username'})
    }

    user.username = username
    user.roles = roles
    user.active = active

    // since this is a mongoose document, if we try to set a property not in model, it will be ignored
    
    // as we do not always expect a user to send a password update, we use an if stmt
    // if password is sent, hash it
    if(password){
        // hash password 
        user.password = await bcrypt.hash(password, 10) // 10 is salt rounds
    }

    const updatedUser = await user.save()

    res.json({message: `${updatedUser.username} updated`})
})

// @desc Delete a user
// @route DELETE /users
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
    const {id} = req.body

    if(!id) {   
        return res.status(400).json({message: 'User ID Required'})
    }


    const note = await Note.findOne({user:id}).lean().exec()

    // if user has notes, we do not delete user
    if(note){
        return res.status(400).json({message: 'User has assigned notes'})
    }

    // if no notes, find user by id and delete
    // here also no lean as we want to persist changes in db as deleted user must not be in db
    const user = await User.findById(id).exec()

    if(!user){  
        return res.status(400).json({message: 'User not found'})
    }

    const result = await user.deleteOne()

    // as result holds data of deleted user, we send it back to client
    const reply = `Username ${result.username} with ID ${result._id} deleted`

    res.json(reply)
})

module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
}

