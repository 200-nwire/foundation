const { Types } = require('mongoose')
const assert = require('assert')

module.exports = class Reference extends Types.ObjectId {
    constructor(id) {
        assert(id, 'empty reference identifier')
        super(id)
    }
}
