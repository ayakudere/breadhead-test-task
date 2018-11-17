const express = require('express')

const Offers = require('./data/offers')

const app = express()

const port = 3000

const offers = new Offers()

app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', '*')
    next()
})

app.get('/offer', (req, res) => {
    res.json(offers.get(req.query))
})

app.listen(port, function () {
    console.log("Running on port: " + port)
})
