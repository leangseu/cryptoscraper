const express = require('express')
// const axios = require('axios')
const request = require('request')
const cheerio = require('cheerio')

const router = express.Router()

const Markets = require('../models/markets')

router.get('/', (req, res) => {
    res.send('Nothing to show here')
})

router.get('/:id', (req, res) => {
    request.get(`https://coinmarketcap.com/currencies/${req.params.id}/`, (err, response, body) => {
        const $ = cheerio.load(body)

        var contents = {
            marketCap: $('span[data-currency-market-cap]').data('usd'),
            volume24h: $('span[data-currency-volume]').data('usd'),
            circulateSupply: $($('.coin-summary-item-detail')[2]).text().trim(),
            totalSupply: $($('.coin-summary-item-detail')[3]).text().trim(),
            twitterLink: $('.twitter-timeline').attr('href'),
            redditLink: $('.reddit-title>a').attr('href'),
            markets: [],
        }

        const marketData = $('tbody>tr')

        marketData.map((index, value) => {
            contents.markets.push({
                rank: $(value).children(':nth-child(1)').text().trim(),
                source: $(value).children(':nth-child(2)').text().trim(),
                pair: $(value).children(':nth-child(3)').text().trim(),
                volume24h: $(value).children(':nth-child(4)').text().trim(),
                price: $(value).children(':nth-child(5)').text().trim(),
                volumePercentage: $(value).children(':nth-child(6)').text().trim(),
                lastUpdate: $(value).children(':nth-child(7)').text().trim()
            })
        })

        res.send(contents)
    })
})

router.get('/historical/:id', (req, res) => {
    var rightNow = new Date();
    var today = rightNow.toISOString().slice(0,10).replace(/-/g,"");
    request.get(`https://coinmarketcap.com/currencies/tron/historical-data/?start=20130428&end=${today}`,
        (error, response, body) => {
            var $ = cheerio.load(body)

            var contents = {
                historical: []
            }
            
            const historicalData = $('tbody>tr')

            historicalData.map((index, value) => {
                contents.historical.push({
                    date: $(value).children(':nth-child(1)').text().trim(),
                    open: $(value).children(':nth-child(2)').text().trim(),
                    high: $(value).children(':nth-child(3)').text().trim(),
                    low: $(value).children(':nth-child(4)').text().trim(),
                    close: $(value).children(':nth-child(5)').text().trim(),
                    volume: $(value).children(':nth-child(6)').text().trim(),
                    marketcap: $(value).children(':nth-child(7)').text().trim(),
                })
            })

            res.send(contents)
        })
})

module.exports = router