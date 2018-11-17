require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const knex = require('knex')({
    client: 'postgres',
    connection: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME
    }
})

const Offers = require('./data/offers')
const Parser = require('./utils/parser')

const app = express()

app.use(bodyParser.json())

const port = process.env.PORT || 3000

const offers = new Offers(knex)

app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', '*')
    next()
})

app.get('/offer', async (req, res) => {
    res.json(await offers.get(req.query))
})

app.post('/parse', (req, res) => {
    Promise.all(
        req.body
            .map(message => ({ ...message, offer: Parser.parse(message.message) }))
            .filter(message => message.offer)
            .map(message => offers.insert(message.offer, message.id, message.date))
    )
        .then(x => res.json({ message: `Inserted ${x.length} rows` }))
        .catch(err => res.status(500).json({ message: err }))
})

app.listen(port, async () => {
    await offers.init()
    console.log('Running on port: ' + port)
})
