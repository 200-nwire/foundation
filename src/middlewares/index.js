const { compose } = require('koa-convert')
const logger = require('koa-logger')
const respond = require('koa-respond')
const helmet = require('koa-helmet')
const cors = require('koa2-cors')
// const pinoLogger = require('koa-pino-logger')
// const jwt = require('koa-jwt')
const roles = require('./roles')

// const { verifyToken } = require('../auth/auth')

function middlewares(config) {
    return [
        logger(),
        // pinoLogger(),
        respond(config.get('test.respond')),
        helmet(config.get('test.helmet')),
        cors(),
        roles.middleware(),
    ]
}

module.exports = (config) => compose(middlewares(config))
