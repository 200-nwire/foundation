const Roles = require('koa-roles')

const user = new Roles({
    async failureHandler(ctx, action) {
        // optional function to customise code that runs when
        // user fails authorisation
        ctx.status = 403
        ctx.body = {
            message: 'Access Denied - insufficient permission to: ' + action,
        }
    },
})

user.use((ctx, action) => {
    console.log(action, ctx.state.user)
    return ctx.state.user && ctx.state.user.scope.includes(action)
})

module.exports = user
