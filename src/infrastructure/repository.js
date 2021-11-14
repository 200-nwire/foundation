const Snapshot = require('./shanpshot')

/**
 * Repository Base Class
 */
class Repository {
    /**
     *
     * @param storage
     */
    constructor(storage) {
        this.storage = storage
        this.items = new Map()
    }

    /**
     * @return {string}
     */
    get name() {
        throw new Error('not implemented')
    }

    /**
     *
     * @param data
     * @return {*}
     */
    cast(data) {
        return data
    }

    /**
     *
     * @param data
     * @return {*}
     */
    toEntity(data) {
        return data
    }

    /**
     *
     * @param {Aggregate} aggregate
     */
    add(aggregate) {
        this.items.set(aggregate.id.toString(), aggregate)
    }

    /**
     *
     * @param {string} id
     * @return {Promise<*>}
     */
    async load(id) {
        id = id.toString()
        if (this.items.has(id)) {
            return this.items.get(id)
        }
        let { payload } = await this.loadSnapshot(id)
        let aggregate = this.toEntity(id, this.cast(payload))
        this.add(aggregate)
        return aggregate
    }

    /**
     *
     * @param {string} id
     * @return {*}
     */
    loadSnapshot(id) {
        return this.storage.load(this.name, id)
    }

    /**
     *
     * @param {Aggregate} aggregate
     * @return {Promise<Event[]>}
     */
    async save(aggregate) {
        let events = aggregate.events || []
        if (aggregate.snapshot) {
            let state = new Snapshot(aggregate.plain())
            state.aggregate.id = aggregate.id.toString()
            state.aggregate.name = this.name
            state.metadata = { ...state.metadata, ...aggregate.meta() }

            events.push(state)
        }

        return events
    }

    /**
     *
     * @return {Promise<Event[]>}
     */
    flush() {
        let saves = []

        this.items.forEach((aggregate, id) => {
            saves.push(this.save(aggregate))
            this.items.delete(id)
        })

        return Promise.all(saves)
    }
}

module.exports = Repository
