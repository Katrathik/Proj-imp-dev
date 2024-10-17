const { logEvents } = require('./logger')

// this is our error handler middleware which overwrites our default error handler

const errorHandler = (err, req, res, next) => {
    logEvents(`${err.name}\t${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,'errLog.log')
    console.log(err.stack) // gives us a lot of error details

    const status = res.statusCode ? res.statusCode : 500 // internal server error
    res.status(status)
    res.json({message: err.message})
}

module.exports = errorHandler