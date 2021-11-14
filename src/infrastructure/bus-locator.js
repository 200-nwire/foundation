const { isString, isFunction, isDirectory, walkSync } = require('../utils')
const {
    HandlerLocator,
    MissingHandlerException,
    InvalidCommandException,
} = require('omnibus')

module.exports = class NamespaceHandlerLocator extends HandlerLocator {
    getHandlerForCommand(commandName, container) {
        if (isString(commandName) === false) {
            throw new InvalidCommandException()
        }

        const handlerName =
            commandName
                .replace(/^\w|[A-Z]|\b\w/g, (word) => word.toUpperCase())
                .replace(/\./g, '')
                .replace(/\s+/g, '') + 'Handler'

        if (!container) {
            MissingHandlerException.forCommand(commandName)
        }

        const foundHandler = container.has(handlerName)
            ? container.resolve(handlerName)
            : null

        if (!foundHandler) {
            MissingHandlerException.forCommand(commandName)
        }

        return foundHandler
    }
}
