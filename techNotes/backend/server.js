require('dotenv').config() // allows us to use .env in our whole project
const express = require("express");
const app = express();
const path = require("path");
const {logger , logEvents} = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const connectDB = require('./config/dbConn');
const mongoose = require('mongoose');
const { error } = require('console');
const PORT = process.env.PORT || 3500;

connectDB()

// use logger before every route
app.use(logger)

app.use(cors(corsOptions))// without options, our rest api is allowed fr all public 

// middleware to process json
app.use(express.json()); // body parser

app.use(cookieParser());// for restapi to parse cookies received 

// telling express where to find static files like css or js that we would use on the server
// express.static is a built-in middleware function in express.js which tells server where to get static files from
app.use('/',express.static(path.join(__dirname, 'public')));

// the below line will also work as public file is relative to where our server file is
// app.use(express.static('public'));

// route for home page
app.use('/',require('./routes/root'));
// route for users
app.use('/auth',require('./routes/authRoutes'));
app.use('/users',require('./routes/userRoutes'));
app.use('/notes',require('./routes/noteRoutes'));


app.all('*', (req, res) => {
    res.status(404);
    if(req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if(req.accepts('json')) {
        res.json({message: '404 Not Found'});
    } else {        
        res.type('txt').send('404 Not Found');                  
    }  
})

app.use(errorHandler)

// only listen once connected to mongoDB
mongoose.connection.once('open',()=>{
    console.log('Connected to MongoDB')
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    })
})

// log mongoEvents here into the mongoLog file
mongoose.connection.on('error',()=>{
    console.log(error)
    // we do not get an error no if not available
    logEvents(`${error.no}\t${error.code}\t${error.syscall}\t${error.hostname}`, 'mongoErrLog.log')
})