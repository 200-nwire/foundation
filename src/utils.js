const fs = require('fs')
const path = require('path')
const capitalizeStr = require('lodash/capitalize')
const camelCaseStr = require('lodash/camelCase')
const upperFirstStr = require('lodash/upperFirst')
const { parsePhoneNumber } = require('libphonenumber-js')

const isDirectory = (dir) => fs.lstatSync(dir).isDirectory()

const walkSync = (file) =>
    isDirectory(file)
        ? fs.readdirSync(file).map((f) => walkSync(path.join(file, f)))
        : file

const capitalize = (s) => capitalizeStr(s)

const camelCase = (s) => camelCaseStr(s)

const upperFirst = (s) => upperFirstStr(s)

const isString = (s) => typeof s === 'string'

const isFunction = (f) => typeof f === 'function'

class PhoneNumber {
    constructor(phone) {
        return parsePhoneNumber(phone, {
            defaultCountry: 'IL',
            defaultCallingCode: '972',
        })
    }
}

module.exports = {
    isDirectory,
    walkSync,
    capitalize,
    camelCase,
    upperFirst,
    isString,
    isFunction,
    PhoneNumber,
}
