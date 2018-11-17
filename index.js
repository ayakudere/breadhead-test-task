const express = require('express')
const bodyParser = require('body-parser')

const Offers = require('./data/offers')
const Parser = require('./utils/parser')

const app = express()

app.use(bodyParser.json());

const port = 3000

const offers = new Offers()

app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', '*')
    next()
})

app.get('/offer', (req, res) => {
    res.json(offers.get(req.query))
})

app.post('/parse', (req, res) => {
    res.send(req.body.map(Parser.parse))
})

app.listen(port, function () {
    console.log("Running on port: " + port)
})
