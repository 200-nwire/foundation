const { DataTransform } = require('node-json-transform')

class Resource {

    constructor (data) {
        this.data = data
        return this.handle()
    }

    handle() {

        if (!this.data || (Array.isArray(this.data) && !this.data.length)) {
            return this.data || {}
        }

        const a = this.cast()
        const operate = Object.keys(a).map(i => {
            return {
                run: a[i],
                on: i
            }
        })

        const map = {
            list: 'data',
            item: this.attributes(),
            remove: this.hidden(),
            defaults: this.defaults(),
            each: this.map,
            operate
        }

        if (Array.isArray(this.data)) {
            return DataTransform({ data: this.data }, map).transform()
        }
        else {
            const result = DataTransform({ data: [this.data] }, map).transform()
            return result[0]
        }


    }

    hidden () {
        return []
    }

    defaults () {
        return {}
    }

    attributes () {
        return Object.keys((Array.isArray(this.data) ? this.data[0] : this.data) || {})
            .reduce((obj, item) => {
                obj[item] = item
                return obj
            }, {})
    }

    cast () {
        return {}
    }

    map (item) {
        // make changes
        return item
    }

}

module.exports = Resource
