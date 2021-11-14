const { Middleware } = require('simple-command-bus')

module.exports = class LoggerMiddleware extends Middleware {
    constructor(logger) {
        super()
        this.logger = logger
    }

    execute(command, next) {
        this.logger.log('[command]', command.name)
        return next(command).then((result) => {
            return (
                result || {
                    code: 202,
                    message: 'Accepted',
                }
            )
        })
    }
}
