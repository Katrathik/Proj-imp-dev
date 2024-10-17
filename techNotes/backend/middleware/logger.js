const { format } = require('date-fns')
const { v4: uuid } = require('uuid')
const fs = require('fs')
const fsPromises = require('fs').promises
const path = require('path')

const logEvents = async (message,logFileName) =>{
    const dateTime = `${format(new Date(),'yyyyMMdd\tHH:mm:ss')}`
    const logTime = `${dateTime}\t${uuid()}\t${message}\n`

    try{
        // if no dir, create it
        if(!fs.existsSync(path.join(__dirname,'..','logs'))){
            await fsPromises.mkdir(path.join(__dirname,'..','logs'))
    }
    // else just append logs(logTime) to the file in reqLog.log file
    await fsPromises.appendFile(path.join(__dirname,'..','logs',logFileName),logTime)
}
    catch(err){
        console.log(err)
    }
}

const logger = (req,res,next) =>{
    logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`,'reqLog.log')
    console.log(`${req.method} ${req.path}`)
    next()
}

module.exports = {logger,logEvents}
