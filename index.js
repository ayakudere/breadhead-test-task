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
});

const Offers = require('./data/offers')
const Parser = require('./utils/parser')

const app = express()

app.use(bodyParser.json());

const port = 3000

const offers = new Offers(knex)

app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', '*')
    next()
})


app.get('/offer', async (req, res) => {
    res.json(await offers.get(req.query))
})

app.post('/parse', (req, res) => {
    Promise.all(req.body.map(rawMessage =>
        offers.insert(Parser.parse(rawMessage))
    )).then(x => res.send(x))
})

app.listen(port, async () => {
    await offers.init()
    console.log("Running on port: " + port)
})
