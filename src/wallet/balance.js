const Dinero = require('dinero.js')

const model = Symbol('model')

class Balance {
    constructor({ amount = 0, currency = 'ILS' } = {}) {
        this[model] = new Dinero({ amount, currency })
    }

    credit({ amount, currency }) {
        this[model] = this[model].add(new Dinero({ amount, currency }))
    }

    debit({ amount, currency }) {
        this[model] = this[model].subtract(new Dinero({ amount, currency }))
    }

    canDebit({ amount, currency }) {
        return this[model].subtract(new Dinero({ amount, currency })).positive()
    }

    plain() {
        return this[model].toObject()
    }
}

module.exports = Balance
