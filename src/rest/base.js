// const filesystem = require('../../../utils/filesystem')
// const toString = (stream, enc) => {
//     let str = ''
//
//     return new Promise ((resolve, reject) => {
//         stream.on('data', data => {
//             str += (typeof enc === 'string') ? data.toString(enc) : data.toString()
//         })
//         stream.on('end', () => {
//             resolve(str)
//         })
//         stream.on('error', err => {
//             reject(err)
//         })
//     })
// }


class BaseController {
    constructor() {

    }

    async index() {}
    async show() {}
    async create() {}
    async update() {}
    async delete() {}

    // async parseMultipart(request) {
    //     request.body = {}
    //
    //     // TODO: ;)
    //     let part
    //     while ((part = await request.parts)) {
    //         if (part.fieldname === 'images') {
    //             request.body[part.fieldname] = await filesystem.handleZip(part)
    //         }
    //
    //         if (part.fieldname === 'geofile') {
    //             request.body[part.fieldname] = await toString(part)
    //         }
    //     }
    //     Object.assign(request.body, request.parts.field)
    // }
}

module.exports = BaseController
