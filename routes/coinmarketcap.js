const express = require('express')
const axios = require('axios')

const router = express.Router()

const Currencies = require('../models/currencies')

router.get('/', (req, res) => {
    axios.get("https://api.coinmarketcap.com/v1/ticker/?limit=0")
    .then(data => {
        res.json(data.data)
    }).catch(err => {
        res.status(403).send(err)
    })
})

router.put('/update', (req, res) => {
    axios.get("https://api.coinmarketcap.com/v1/ticker/?limit=0")
    .then(data => {
        Currencies.count({}, function(err, count) {
            if (err) {
                console.log(err)
            }
            if (data.data.length !== count) {
                Currencies.collection.drop()
                Currencies.create(data.data, (err, doc) => {
                    if(err) console.log(err)
                })
            }
        });
        res.json(data.data)
    }).catch(err => {
        res.status(403).send(err)
    })
})

router.get('/coin/:id', (req, res) => {
    const id = req.params.id.toString()
    axios.get('https://api.coinmarketcap.com/v1/ticker/' + id)
    .then(data => {
        res.json(data.data)
    }).catch(err => {
        res.status(403).send(err)
    }) 
})

module.exports = router