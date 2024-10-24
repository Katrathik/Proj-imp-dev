const rateLimit = require('express-rate-limit')
const { logEvents } = require('./logger')


const loginLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5, // limit each IP to 5 login requests per minute
    message:{
        message: 'Too many login attempts from this IP, please try again after a minute',
    },
        handler:(req, res,next,options) => {
            // gets triggered on achieving limit
            logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`,'reqLog.log')
            res.status(options.statusCode) .send(options.message)
        },
        standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
        legacyHeaders: false, //  Disable the `X-RateLimit-*` headers
    

})

module.exports = loginLimiter