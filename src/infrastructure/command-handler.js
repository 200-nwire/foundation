class CommandHandler {
    constructor(workspace) {
        this.workspace = workspace
    }

    /**
     *
     * @param {import('./command').Command} command
     * @returns {Promise<*>}
     */
    async handle(command) {
        throw new Error(`Implement handler for ${command.name}`)
    }
}

module.exports = CommandHandler
