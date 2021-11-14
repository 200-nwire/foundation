const LoadRoutes = require('./rest/routes')
const views = require('koa-views')
const bodyParser = require('koa-bodyparser')
const loadMiddlewares = require('./middlewares')

const { compose } = require('koa-convert')

class RestAPI {
    constructor(options) {
        this.helper = options.helper
        this.config = options.config

        this.container = options.container
    }

    middleware() {
        return compose([
            bodyParser(),
            // async (ctx, next) => {
            //     if (ctx.request.query.include) {
            //         ctx.request.query.include = ctx.request.query.include.split(',')
            //     }
            //     await next()
            // },
            views(this.helper.viewsPath(), {
                // map: {
                //     html: 'mustache'
                // }
            }),
            loadMiddlewares(this.config),
        ])
    }

    routes() {
        const schema = require(this.helper.schemaPath())
        return LoadRoutes(
            this.helper.routesPath(),
            Object.assign({}, schema.models, schema.requests.refs),
            schema,
            this.container,
            this.config.get('swagger')
        ).middleware()
    }
}

module.exports = RestAPI
