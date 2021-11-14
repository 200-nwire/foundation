const { SwaggerAPI } = require('../swagger')
const Router = require('koa-joi-router')

const roles = require('../middlewares/roles')

const router = Router()

router.prefix('/api/v1')
router.use(router.middleware())

//const pkg = require('../../../package')
//const hash = require('../../../.commit')
// hash.commit = `<a target="_blank" href="${pkg.repository.url.replace(
//     '.git',
//     ''
// )}/commit/${hash.commit}">${hash.commit}</a>`
const os = require('os')
const t = require('tableify')

/**
 * Generate Swagger json from the router object
 */
const generator = new SwaggerAPI()
generator.addJoiRouter(router, {})

function LoadRoutes(path, models, schema, container, config) {
    const routes = require('require-dir')(path, { extensions: ['.js'] })

    schema.Types = Router.Joi

    Object.keys(routes).forEach((route) => {
        const NRouter = Router()
        const r = routes[route]
        const a = r(schema, container, roles)
        NRouter.prefix(a.prefix)
        router.use(NRouter.route(a.routes).middleware())
        generator.addJoiRouter(NRouter, {})
    })

    const spec = generator.generateSpec(config, { models })

    /**
     * Swagger JSON API
     */
    router.get('/swagger.json', async (ctx) => {
        ctx.body = JSON.stringify(spec, null, '  ')
    })

    /**
     * API documentation
     */
    router.get('/_docs', async (ctx) => {
        await ctx.render('swagger')
    })

    router.get('/', async (ctx) => {
        const environments = {
            'node version': process.versions['node'],
            hostname: os.hostname(),
            platform: `${process.platform}/${process.arch}`,
        }
        const data = {
            // name: pkg.name,
            // version: pkg.version,
            environment: process.env.NODE_ENV,
            // description: pkg.description,
            docs: '<a href="/api/v1/_docs">/api/v1/_docs</a>',
        }

        await ctx.render('info', {
            data: t(data),
            envs: t(environments),
            // hash: t(hash),
        })
    })

    router.get('/_health', async (ctx) => {
        // TODO: Improve healthcheck logic
        // status: ['pass', 'fail', 'warn']
        const data = {
            status: 'pass',
        }
        ctx.body = data
    })

    return router
}

module.exports = LoadRoutes
