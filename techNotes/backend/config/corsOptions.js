const allowedOrigins = require('./allowedOrigins')
// same in docs
const corsOptions = {
    origin: (origin, callback) => {
        // allow requests with no origin(like thunder client ) or only in the allowedOrigins list
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials:true, // sets access-control-allow-credentials header instead of manually doing it in another middleware
    optionsSuccessStatus: 200
}

module.exports = corsOptions