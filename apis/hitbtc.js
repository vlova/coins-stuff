const { getByUrl } = require("../common/api-helpers");
const { hitBtcAuth } = require("../common/secure-config");

const baseHitBtc = "https://" + hitBtcAuth + "@api.hitbtc.com/api";

async function getHitBtcBalance() {
    var response = await getByUrl(baseHitBtc + "/2/trading/balance");

    return response
        .map(i => ({
            ...i,
            available: parseFloat(i.available),
            reserved: parseFloat(i.reserved),
        }))
        .filter(i => i.available > 0 || i.reserved > 0);
}

async function getHitBtcSymbols() {
    var response = await getByUrl(baseHitBtc + "/2/public/symbol");
    const symbolMap = {}
    for (let item of response) {
        symbolMap[item.id] = {
            id: item.id,
            baseCurrency: item.baseCurrency,
            quoteCurrency: item.quoteCurrency
        }
    }
    return symbolMap;
}

async function getHitBtcTickers() {
    var response = await getByUrl(baseHitBtc + "/2/public/ticker");
    return response;
}

async function getHitBtcExchangeRates() {
    const [symbols, tickers] = await Promise.all([getHitBtcSymbols(), getHitBtcTickers()]);
    const exchangeRates = {};
    for (const ticker of tickers) {
        const symbol = symbols[ticker.symbol];
        exchangeRates[symbol.baseCurrency] = exchangeRates[symbol.baseCurrency] || {};
        exchangeRates[symbol.baseCurrency][symbol.quoteCurrency] = {
            ...ticker
        };
    }

    return exchangeRates;
}

async function getHitBtcTrades(limit = 100) {
    return await getByUrl(baseHitBtc + "/2/history/trades?&limit=" + limit);
}

module.exports = {
    baseHitBtc,
    getHitBtcBalance,
    getHitBtcSymbols,
    getHitBtcTickers,
    getHitBtcExchangeRates,
    getHitBtcTrades
};