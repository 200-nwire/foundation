const KoaApplication = require('koa')
const error = require('koa-json-error')
const views = require('koa-views')

class Application extends KoaApplication {
    constructor(options) {
        super(options)

        this.init(options)
    }

    init({ config }) {
        this.use(
            error({
                // Avoid showing the stacktrace in 'production' env
                postFormat: (e, obj) => {
                    delete obj.stack
                    return obj
                },
            })
        )

        this.use(async (ctx, next) => {
            if (ctx.path === '/') {
                ctx.redirect('/api/v1')
            }
            await next()
        })

        this.use(
            views(__dirname + '/../../resources/views', {
                // map: {
                //     html: 'mustache'
                // }
            })
        )

        this.on('error', (err) => {
            console.log(err.message)
            if (config.get('sentry.enabled')) {
                //Sentry.captureException(err)
            }
        })
    }
}

module.exports = Application
