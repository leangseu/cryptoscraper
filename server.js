//module
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
// route
const coinmarketcap = require('./routes/coinmarketcap')
const markets = require('./routes/buyingMarket')

//constant
const PORT = process.env.PORT || 4000

// express app
const app = express()

// connect to database
mongoose.connect('mongodb://admin:admin@ds239587.mlab.com:39587/cryptoscraper', (err) => {
    if (err) console.log("Failed to connect to db - " + err)
})


// body parser
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


app.get('/', (req, res) => {
    res.send('HOME')
})

app.use('/api/', coinmarketcap)
app.use('/api/market', markets)


app.listen(PORT, () => {
    console.log('server start at port ' + PORT)
})