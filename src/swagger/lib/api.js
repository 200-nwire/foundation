'use strict'

const assert = require('assert')
const cloneDeep = require('lodash/cloneDeep')
const get = require('lodash/get')
const generator = require('./generator')

class SwaggerAPI {
    constructor() {
        this.apiRoutes = []
    }

    /**
     * Add a `koa-joi-router` router to the API.
     * @param {Router} router - koa-joi-router instance
     * @param {object} options
     * @param {string} [options.prefix]
     */
    addJoiRouter(router, options) {
        options = options || {}

        if (typeof options === 'string') {
            options = { prefix: options }
        }

        if (!Array.isArray(router.routes)) {
            throw new TypeError(
                'router does not have exposed .routes array' +
                    ' (not a joi-router instance)'
            )
        }

        const prefix = get(router, 'router.opts.prefix')
        router.routes.forEach(function (route) {
            this.apiRoutes.push({
                route: route,
                prefix: options.prefix || prefix,
            })
        }, this)
    }

    /**
     * Generate a Swagger 2.0 specification as an object for this API.
     *
     * @param {object} baseSpec - base document
     * @param {object} baseSpec.info
     * @param {string} baseSpec.info.title
     * @param {string} baseSpec.info.version
     * @param {object} baseSpec.tags
     * @param {string} baseSpec.tags.name
     * @param {string} baseSpec.tags.description
     * @param {object} [options]
     * @param {object} [options.warnFunc]
     * @param {object} [options.defaultResponses]
     * @returns {object} swagger 2.0 specification
     */
    generateSpec(baseSpec, options) {
        options = Object.assign(
            {
                warnFunc: console.warn,
                // defaultResponses: {
                //     200: {
                //         description: 'Success'
                //     }
                // },
            },
            options
        )

        assert(baseSpec.info, 'baseSpec.info parameter missing')
        assert(baseSpec.info.title, 'baseSpec.info.title parameter missing')
        assert(baseSpec.info.version, 'baseSpec.info.version parameter missing')

        const doc = cloneDeep(baseSpec)
        doc.openapi = '3.0.0'
        doc.paths = doc.paths || {}
        doc.tags = doc.tags || []

        doc.components = {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                },
            },
            schemas: {},
        }

        doc.security = [
            {
                bearerAuth: [],
            },
        ]

        this.apiRoutes.forEach(function (apiRoute) {
            const routeOptions = Object.assign({}, options, {
                prefix: apiRoute.prefix,
            })

            const routePaths = generator.routeToSwaggerPaths(
                apiRoute.route,
                routeOptions
            )

            generator.mergeSwaggerPaths(doc.paths, routePaths, options)
        }, this)

        Object.keys(options.models).forEach((model) => {
            let m = options.models[model]
            delete m.$_terms.metas
            doc.components.schemas[model] = generator.swaggerizeModel(m)
        })

        return doc
    }
}

module.exports = SwaggerAPI
