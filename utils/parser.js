const _ = require('lodash')

const messageRegex = /([^\n]+)\n\nстарая цена:\s(\d+)[^\n]+\nновая цена:\s(\d+)\s\((.+)\)\s([^\n]+)\n\nразмеры:\s([^\n]+)/

const expandSizes = (sizesString) => {
    const [type, ...sizes] = sizesString.split(' ')

    if (type === '#One') {
        return { type: null, sizes: 'onesize' }
    } else if (type[0] === '#') {
        return { type: null, sizes: sizesString.replace(/#/g, '').split(' ') }
    } else if (/\w{2}/.test(type)) {
        return {
            type,
            sizes: _.flatMap(sizes, (size) => {
                if (size.includes('-')) {
                    const [fromSize, toSize] = size.split('-').map(parseFloat)

                    return _.range(fromSize, toSize, 0.5).map(String)
                } else {
                    return size.replace(/,$/, '')
                }
            })
        }
    } else {
        throw "Unknown size type"
    }
}

class Parser {
    static parse(message) {
        const parsedMessage = messageRegex.exec(message)

        if (parsedMessage) {
            const [_, name, oldPrice, newPrice, promoCode, promoLink, sizeString] = parsedMessage

            const sizes = expandSizes(sizeString)
            const discount = (1 - newPrice / oldPrice) * 100

            return { name, price: parseFloat(newPrice), promoLink, sizes, discount }
        }
    }
}

module.exports = Parser