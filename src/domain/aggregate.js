const Pipeline = require('pipeline-js')

class Aggregate {
    constructor(id, model) {
        this.model = model
        this.id = id
        this.version = 0
        this.events = []
    }

    assign(values) {
        for (const [key, value] of Object.entries(values)) {
            if (value) {
                this.model[key] = value
            }
        }
    }

    get(key) {
        if (typeof key === 'string') {
            return this.model[key] || null
        }
    }

    plain() {
        return this.model
    }

    meta() {
        return {}
    }

    get snapshot() {
        return true
    }

    /**
     *
     * @param {Event} event
     */
    recordThat(event) {
        event.aggregate.id = this.id.toString()
        event.aggregate.name = this.constructor.name.toLowerCase()
        event.metadata = { ...event.metadata, ...this.meta() }

        this.events.push(event)
        this.apply(event)
        this.version++
    }

    /**
     *
     * @param {Event} event
     */
    apply(event) {
        const eventName = event.constructor.name.replace('Event', '')
        const methodName = `when${eventName}`

        if (typeof this[methodName] == 'function') {
            this[methodName].call(this, event)
        }
    }

    validate(pipes) {
        new Pipeline(pipes).process(this.plain())
    }
}

module.exports = Aggregate
