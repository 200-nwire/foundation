const collect = require('collect.js')

const repositories = Symbol('repositories')
const workload = Symbol('workload')

/**
 * @property {Storage} storage
 * @property {Projector} projector
 * @property {awilix} scope
 */
class Workspace {
    constructor(scope) {
        this.scope = scope
        this[repositories] = {}
        this[workload] = collect([])
    }

    register(name, repository) {
        this[repositories][name] = new repository(this.storage)
    }

    get(name) {
        if (!this[repositories][name]) {
            this[repositories][name] = this.scope.resolve(name)
        }
        return this[repositories][name]
    }

    async commit() {
        let promises = Object.values(this[repositories]).map((repository) =>
            repository.flush()
        )
        let events = await Promise.all(promises)
        return this[workload].merge(
            collect([].concat(...events))
                .collapse()
                .all()
        )
    }

    record(message) {
        this[workload].push(message)
    }
}

module.exports = Workspace
