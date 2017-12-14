const { getByUrl } = require("../common/api-helpers");
const { primaryCurrency } = require("../common/config");

const cryptoCompareBase = "https://min-api.cryptocompare.com/data/";

async function getCryptoCompareExchangeRates(currencies) {
    let bannedCurrencies = [];
    currencies = currencies.filter(c => bannedCurrencies.indexOf(c) === -1);
    var response = await getByUrl([
        cryptoCompareBase,
        "pricemulti?fsyms=" + currencies.join(","),
        "&tsyms=" + primaryCurrency
    ].join(""));
    return response;
}

async function getHistoryData({ type, fromCurrency, toCurrency, limit }) {
    if (limit > 2000) {
        throw {
            msg: "Too large limit for historydata",
            limit
        };
    }

    var response = await getByUrl([
        cryptoCompareBase,
        "histo" + type + "?",
        "&fsym=" + fromCurrency,
        "&tsym=" + toCurrency,
        "&limit=" + limit || 60
    ].join(""));

    return response;
}

module.exports = {
    cryptoCompareBase,
    getCryptoCompareExchangeRates,
    getHistoryData
};