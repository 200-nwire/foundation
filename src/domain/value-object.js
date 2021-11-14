module.exports = class ValueObject {
    constructor(attributes) {
        this.attributes = Object.freeze(attributes)
    }
}
