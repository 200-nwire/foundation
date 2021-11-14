const {
    CommandBus,
    CommandHandlerMiddleware,
    ClassNameExtractor,
    LoggerMiddleware,
    HandleInflector,
} = require('omnibus')

const EventBus = require('emittery')
const NamespaceHandlerLocator = require('./bus-locator')
let locator = new NamespaceHandlerLocator()

// const { Queue } = require('foundation')

// Handler middleware
const commandHandlerMiddleware = new CommandHandlerMiddleware(
    new ClassNameExtractor(),
    locator,
    new HandleInflector()
)

// Command bus instance
const commandBus = new CommandBus(
    [new LoggerMiddleware(console), commandHandlerMiddleware],
    {},
    {},
    new EventBus()
)

// commandBus.dispatch = async (command) => {
//     const jobName = command.constructor.name.replace('Command', '')
//     return await Queue.add(jobName, command, command.options)
// }

module.exports = commandBus
module.exports.locator = locator
