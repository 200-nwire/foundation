const Balance = require('./balance')
const Ledger = require('./ledger')

class Wallet {
    constructor({ balance, account }) {
        this.balance = new Balance(balance)

        this.account = account.id
        this.account_type = account.type

        this.ledger = new Ledger([])
    }

    get entries() {
        return this.ledger.entries.all()
    }

    get current_balance() {
        return this.balance.plain()
    }

    deposit({ amount, currency, reason, group, metadata, transaction }) {
        // TODO: check same currency
        this.balance.credit({ amount, currency })
        return this.ledger.credit({
            amount,
            currency,
            operation: 'deposit',

            account: this.account,
            account_type: this.account_type,

            current_balance: this.current_balance.amount,

            transaction,

            description: reason,
            group,

            metadata,
        })
    }

    withdraw({ amount, currency, reason, group, metadata, transaction }) {
        if (!this.balance.canDebit({ amount, currency })) {
            throw new Error('Insufficient Funds')
        }

        this.balance.debit({ amount, currency })

        return this.ledger.debit({
            amount,
            currency,
            operation: 'withdrawal',

            account: this.account,
            account_type: this.account_type,

            current_balance: this.current_balance.amount,

            transaction,

            description: reason,
            group,

            metadata,
        })
        // TODO: force// check status
    }

    transfer({
        amount,
        currency,
        reason,
        group,
        metadata,
        transaction,
        additional_account,
        additional_account_type,
    }) {
        if (!this.balance.canDebit({ amount, currency })) {
            throw new Error('Insufficient Funds')
        }

        this.balance.debit({ amount, currency })

        return this.ledger.debit({
            amount,
            currency,
            operation: 'transfer',

            account: this.account,
            account_type: this.account_type,

            current_balance: this.current_balance.amount,

            additional_account,
            additional_account_type,

            transaction,

            description: reason,
            group,

            metadata,
        })
    }

    accept({
        amount,
        currency,
        reason,
        group,
        metadata,
        transaction,
        additional_account,
        additional_account_type,
    }) {
        this.balance.credit({ amount, currency })

        return this.ledger.credit({
            amount,
            currency,
            operation: 'transfer',

            account: this.account,
            account_type: this.account_type,

            current_balance: this.current_balance.amount,

            additional_account,
            additional_account_type,

            transaction,

            description: reason,
            group,

            metadata,
        })
    }

    approve(recordId) {
        this.model.balance.markAvailable(recordId)
    }

    plain() {
        let { balance, account, account_type, ledger } = this
        return {
            balance: balance.plain(),
            account,
            account_type,
            entries: ledger.entries.all(),
        }
    }
}

module.exports = Wallet
