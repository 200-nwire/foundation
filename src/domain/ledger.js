class Ledger {
    constructor(entries = []) {
        this.entries = entries
    }

    log(entry) {
        this.entries.push(entry)
        return entry
    }
}

module.exports = Ledger
