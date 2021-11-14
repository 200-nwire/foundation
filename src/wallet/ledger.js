const Entry = require('./entry')
const collect = require('collect.js')
const Identity = require('../domain/identity')

class Ledger {
    constructor(entries = []) {
        this.entries = collect(entries).mapInto(Entry)
    }

    credit(entry) {
        return this.log(this.toEntry(entry, 'credit'))
    }

    debit(entry) {
        return this.log(this.toEntry(entry, 'debit'))
    }

    toEntry(
        {
            id = new Identity(),
            amount,
            currency,
            operation,

            account,
            account_type,

            additional_account = null,
            additional_account_type = null,

            ending_balance,

            transaction = null,

            description = '',
            status = 'available',
            group,

            metadata = {},
            created_on = new Date(),
            modified_on = new Date(),
        },
        type
    ) {
        return new Entry({
            id,
            amount,
            currency,
            operation,

            type,

            account,
            account_type,

            additional_account,
            additional_account_type,

            ending_balance,

            transaction,

            description,
            status,
            group,

            metadata,
            created_on,
            modified_on,
        })
    }

    log(entry) {
        this.entries.push(entry)
        return entry.plain()
    }
}

module.exports = Ledger
