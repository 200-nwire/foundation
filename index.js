const Aggregate = require('./src/domain/aggregate')
const Identity = require('./src/domain/identity')
const Reference = require('./src/domain/reference')
const Balance = require('./src/domain/balance')
const Ledger = require('./src/domain/ledger')
const Wallet = require('./src/wallet/wallet')
const Workspace = require('./src/infrastructure/workspace')
const Repository = require('./src/infrastructure/repository')
const Utils = require('./src/utils')
const ValueObject = require('./src/domain/value-object')
const Projector = require('./src/infrastructure/projector')
const CommandHandler = require('./src/infrastructure/command-handler')
const { Pagination, paginationResolvers } = require('./pagination')
const NamespaceHandlerLocator = require('./src/infrastructure/bus-locator')





const BaseController = require('./src/rest/base')
const LoadRoutes = require('./src/rest/routes')
const Resource = require('./src/rest/Resource')


const collect = require('collect.js')

const Kernel = require('./src/app')
const RestAPI = require('./src/rest-api')
const Helper = require('./src/helper')

const aqp = require('./src/rest/query')


module.exports = {
    Aggregate,
    Identity,
    Reference,
    Balance,
    Ledger,
    Wallet,
    Repository,
    NamespaceHandlerLocator,
    CommandHandler,
    ValueObject,
    Projector,
    Workspace,
    Pagination,
    paginationResolvers,
    Utils,
    Kernel,
    RestAPI,
    Helper,
    BaseController,
    LoadRoutes,
    aqp,
    // Queue,
    /**
     * Router handlers, proxy for controllers
     * Intersect method calls for `return` structure
     *
     * @param Handler
     * @returns {*|void|never|*}
     */
    makeHandler2: (handler) => {
        const controller = new Proxy(handler, {
            get (target, prop) {
                const value = target[prop]
                return (typeof value === 'function') ? new Proxy(value.bind(target), {
                    async apply(target, thisArg, args) {

                        const body = collect(args[0].request.body)
                        const withParams = body.merge(args[0].request.params)
                        const input = withParams.merge(args[0].request.query)

                        args[0].input = input

                        const result = await target.apply(thisArg, args)

                        if (result) {
                            return args[0].ok({
                                data: result
                            })
                        }
                    }
                }) : value
            }
        })

        return controller
    },
    Resource,
}


