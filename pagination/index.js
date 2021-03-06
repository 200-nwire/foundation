const Pagination = require('./pagination')
const ElasticPagination = require('./search-pagination')
const TypeAhead = require('./type-ahead')
const paginationResolvers = require('./resolvers')
const plugins = require('./plugins')

module.exports = {
    Pagination,
    TypeAhead,
    ElasticPagination,
    paginationResolvers,
    plugins,
}
