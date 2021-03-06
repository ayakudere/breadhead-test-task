const moment = require('moment')

const tableName = 'offers'

class Offers {
    constructor(knex) {
        this.knex = knex
    }

    async init() {
        const tableExists = await this.knex.schema.hasTable(tableName)

        if (!tableExists) {
            return await this.knex.schema.createTable(tableName, t => {
                t.integer('id')
                    .primary()
                    .unsigned()
                t.string('name')
                t.string('brand')
                t.string('shoeType')
                t.decimal('price')
                t.string('promo_link')
                t.float('discount')
                t.string('size_type', 2)
                t.jsonb('sizes')
                t.timestamp('date')
            })
        }
    }

    get(params) {
        let query = this.knex(tableName)

        const { name, brand, shoeType, priceFrom, priceTo, discountFrom, discountTo, sizes, dateFrom, dateTo } = params

        if (name) query = query.whereRaw(`LOWER(name) LIKE ?`, [`%${name}%`])

        if (brand) query = query.where('brand', '=', brand.toLowerCase())

        if (shoeType) query = query.where('shoeType', '=', brand.toLowerCase())

        if (priceFrom) query = query.where('price', '>=', priceFrom)

        if (priceTo) query = query.where('price', '<=', priceTo)

        if (discountFrom) query = query.where('discount', '>=', discountFrom)

        if (discountTo) query = query.where('discount', '<=', discountTo)

        if (dateFrom) query = query.where('date', '>=', moment.unix(dateFrom).utc().format())

        if (dateTo) query = query.where('date', '<=', moment.unix(dateTo).utc().format())

        if (sizes) {
            const parts = sizes.split(',')

            query = query.where(builder => {
                return parts.reduce((sizeQuery, rawSize) => {
                    const [size, sizeType] = rawSize.split(':').reverse()

                    if (sizeType) {
                        return sizeQuery.orWhere(q =>
                            q
                                .where('size_type', '=', sizeType)
                                .andWhereRaw('sizes \\?| array[?]', size)
                        )
                    } else {
                        return sizeQuery.orWhere(q =>
                            q
                                .where('size_type', 'is', null)
                                .andWhereRaw('sizes \\?| array[?]', size)
                        )
                    }
                }, builder)
            })
        }

        return query
    }

    insert(offer, message_id, date) {
        return this.knex.table(tableName).insert({
            id: message_id,
            name: offer.name,
            brand: offer.brand,
            shoeType: offer.shoeType,
            price: offer.price,
            promo_link: offer.promoLink,
            discount: offer.discount,
            size_type: offer.sizes.type,
            sizes: JSON.stringify(offer.sizes.sizes),
            date: moment.unix(date).utc().format()
        }).catch(e => {
            if (e.constraint !== 'offers_pkey') {    // Ignoring already inserted offers
                throw e
            }
        })
    }
}

module.exports = Offers
