const assert = require('assert')

class Entry {
    constructor({
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
    }) {
        // assert(total_goal_amount, 'wrong goal amount')

        // ['transfer', 'adjustment', 'withdrawal', 'deposit']

        // ['debit', 'credit']

        // ['available', 'pending', 'canceled']

        this.id = id
        this.amount = amount
        this.currency = currency
        this.operation = operation
        this.type = type
        this.account = account
        this.account_type = account_type
        this.additional_account = additional_account
        this.additional_account_type = additional_account_type
        this.ending_balance = ending_balance
        this.transaction = transaction
        this.description = description
        this.status = status
        this.group = group
        this.metadata = metadata
        this.created_on = created_on
        this.modified_on = modified_on
    }

    plain() {
        return { ...this }
    }
}

module.exports = Entry
