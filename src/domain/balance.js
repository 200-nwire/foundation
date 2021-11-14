const Dinero = require('dinero.js')
const Ledger = require('./ledger')
const Identity = require('./identity')

const addProperties = (model, properties = []) => {
    properties.forEach((property) => {
        Object.assign(model, { property: property.bind(model) })
    })
    return model
}

const model = Symbol('model')

class Balance {
    constructor({ amount = 0, currency = 'ILS' } = {}) {
        this[model] = new Dinero({ amount, currency })
        this.ledger = new Ledger()
    }

    credit(entry) {
        let {
            id = new Identity(),
            amount,
            currency,
            operation,

            type = 'credit',

            account,
            account_type,

            additional_account = null,
            additional_account_type = null,

            // ending_balance,

            transaction = null,

            description = '',
            status = 'available',
            group,

            metadata = {},
            created_on = new Date(),
            modified_on = new Date(),
        } = entry
        this[model] = this[model].add(new Dinero({ amount, currency }))
        return this.ledger.log({
            id,
            amount,
            currency,
            operation,

            type,

            account,
            account_type,

            additional_account,
            additional_account_type,

            // ending_balance,

            transaction,

            description,
            status,
            group,

            metadata,
            created_on,
            modified_on,
        })
    }

    debit(entry) {
        let {
            id = new Identity(),
            amount,
            currency,
            operation,

            type = 'debit',

            account,
            account_type,

            additional_account = null,
            additional_account_type = null,

            // ending_balance,

            transaction = null,

            description = '',
            status = 'available',
            group,

            metadata = {},
            created_on = new Date(),
            modified_on = new Date(),
        } = entry
        this[model] = this[model].subtract(new Dinero({ amount, currency }))
        return this.ledger.log({
            id,
            amount,
            currency,
            operation,

            type,

            account,
            account_type,

            additional_account,
            additional_account_type,

            // ending_balance,

            transaction,

            description,
            status,
            group,

            metadata,
            created_on,
            modified_on,
        })
    }

    plain() {
        return this[model].toObject()
    }
}

module.exports = Balance
