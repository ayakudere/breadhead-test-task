const messageRegex = /([^\n]+)\n\nстарая цена:\s(\d+)[^\n]+\nновая цена:\s(\d+)\s\((.+)\)\s([^\n]+)\n\nразмеры:\s([^\n]+)/

const expandSizes = (sizesString) => {
    const [type, ...sizes] = sizesString.split(' ')

    if (type === '#One') {
        return { type: null, sizes: 'onesize' }
    } else if (type[0] === '#') {
        return { type: null, sizes: sizesString.replace(/#/g, '').split(' ') }
    } else if (/\w{2}/.test(type)) {
        return { type, sizes }
    } else {
        throw "Unknown size type"
    }
}

class Parser {
    static parse(message) {
        const parsedMessage = messageRegex.exec(message)

        if (parsedMessage) {
            const [_, name, oldPrice, newPrice, promoCode, promoLink, sizes] = parsedMessage

            return { name, newPrice, promoLink, sizes: expandSizes(sizes) }
        }
    }
}

module.exports = Parser