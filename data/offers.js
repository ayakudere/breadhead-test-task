const stubOffers = []
const tableName = 'offers'

class Offers {
    constructor(knex) {
        this.knex = knex
    }

    async init() {
        const tableExists = await this.knex.schema.hasTable(tableName)

        if (!tableExists) {
            return await this.knex.schema.createTable(tableName, (t) => {
                t.increments('id').primary().unsigned()
                t.string('name')
                t.decimal('price')
                t.string('promo_link')
                t.float('discount')
                t.string('size_type', 2)
                t.json('sizes')
                t.timestamp('date')
            })
        }
    }

    get(params) {
        return stubOffers
    }

    insert(offer) {
        return this.knex.table(tableName).insert({
            name: offer.name,
            price: offer.price,
            promo_link: offer.promoLink,
            discount: offer.discount,
            size_type: offer.sizes.type,
            sizes: JSON.stringify(offer.sizes.sizes),
            date: 'now'
        })
    }
}

module.exports = Offers