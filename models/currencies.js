const mongoose = require('mongoose')

const currencies = mongoose.Schema({
    id: String,
    name: String,
    symbol: String,
    rank: Number
})

module.exports = mongoose.model('Currencies', currencies)