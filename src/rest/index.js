const CampaignController = require('./CampaignController')
const VillageController = require('./VillageController')
const ReportController = require('./ReportController')
const RecommendationsController = require('./RecommendationsController')

const collect = require('collect.js')

/**
 * Router handlers, proxy for controllers
 * Intersect method calls for `return` structure
 *
 * @param Handler
 * @returns {*|void|never|*}
 */
const makeHandler = (Handler) => {

    const controller = new Proxy(new Handler(), {
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

}

module.exports = {
    /**
     * @type {CampaignController}
     */
    CampaignController: makeHandler(CampaignController),
    /**
     * @type {VillageController}
     */
    VillageController: makeHandler(VillageController),
    /**
     * @type {ReportController}
     */
    ReportController: makeHandler(ReportController),
    /**
     * @type {RecommendationsController}
     */
    RecommendationsController: makeHandler(RecommendationsController)
}
