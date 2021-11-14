class Projector {
    constructor() {
        this.projections = {}
    }

    handle(events) {
        return Promise.all(events.map((event) => this.project(event)))
    }

    /**
     *
     * @param {DomainEvent} event
     * @return {Promise<void>}
     */
    project(event) {
        const eventName = event.name
            .replace(/^\w|[A-Z]|\b\w/g, (word) => word.toUpperCase())
            .replace(/\./g, '')
            .replace(/\s+/g, '')
        const methodName = `when${eventName}`

        if (typeof this.projections[methodName] == 'function') {
            return this.projections[methodName].call(this, event)
        }
        return Promise.resolve()
    }

    registerProjections(projections) {
        Object.assign(this.projections, projections)
    }
}

module.exports = Projector
