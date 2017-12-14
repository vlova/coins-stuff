require('console.table');

const { prettyWrite } = require("./common/helpers");
const { getHistoryData } = require("./apis/cryptocompare");
const { getHitBtcBalance } = require("./apis/hitbtc");
const { orderBy } = require("lodash");
const { primaryCurrency } = require("./common/config");
const leftPad = require('left-pad')

const timeTypeShorthand = {
    minute: 'm',
    hour: 'h',
    day: 'd'
}

async function getPriceAt({ fromCurrency, toCurrency, moveInPastType, moveInPastCounts }) {
    const history = await getHistoryData({
        fromCurrency,
        toCurrency,
        type: moveInPastType,
        limit: moveInPastCounts.reduce((a, b) => Math.max(a, b), 0) + 1
    });

    const prices = history.Data.reverse();

    return moveInPastCounts
        .map(index => ({
            fromCurrency,
            toCurrency,
            diff: "f " + index + timeTypeShorthand[moveInPastType],
            price: prices[index]
                ? ((prices[index].low + prices[index].high) / 2)
                : undefined
        }));
}

function addGrowthRate(prices) {
    const resultPrices = [];
    let actualPrice = prices[0].price;
    let accumulatedGrow = 0;
    for (let i = 0; i < prices.length; i++) {
        // flow of prices: -30m, -1d, -30d
        // so it's reversed. We are processing oldest price
        const oldestPrice = prices[i].price;
        const newestPrice = (prices[i - 1] || { price: oldestPrice }).price;

        const factor = newestPrice / oldestPrice;
        const accumulatedFactor = actualPrice / oldestPrice;

        const grow = ((newestPrice - oldestPrice) / (oldestPrice || newestPrice)) * 100;
        const accumulatedGrow = ((actualPrice - oldestPrice) / (oldestPrice || actualPrice)) * 100;

        resultPrices.push({
            ...prices[i],
            grow,
            accumulatedGrow,
            factor,
            accumulatedFactor
        });
    }

    return resultPrices;
}

async function getPricesAtKeyPoints(fromCurrency) {
    const example = {
        fromCurrency,
        toCurrency: primaryCurrency,
    }

    const prices = await Promise.all([
        getPriceAt({
            ...example,
            moveInPastType: 'minute',
            moveInPastCounts: [0, 30]
        }),
        getPriceAt({
            ...example,
            moveInPastType: 'hour',
            moveInPastCounts: [1, 4, 8]
        }),
        getPriceAt({
            ...example,
            moveInPastType: 'day',
            moveInPastCounts: [1, 2, 10, 30]
        })
    ]);

    return addGrowthRate(prices
        .reduce((res, prices) => [...res, ...(prices || [])], [])
    );
}

function formatGrow(number) {
    if (number > 0) {
        return "+" + number.toFixed(2);
    }

    return number.toFixed(1);
}

function pricesToTableRow(prices, balance) {
    const balanceEnhanced = {};
    for (const item of balance) {
        balanceEnhanced[item.currency] = (item.available + item.reserved);
    }

    const row = {}

    const priceLeftPad = prices
        .map(item => balanceEnhanced[item.fromCurrency].toFixed(5))
        .map(coins => (coins + '').length)
        .reduce((a, b) => Math.max(a, b), 1);

    let isFirst = true;
    for (const item of prices) {
        if (isFirst) {
            isFirst = false;
            continue;
        }
        row['currency'] = item.fromCurrency;
        row['coins'] = leftPad(balanceEnhanced[item.fromCurrency].toFixed(5), priceLeftPad);
        let beautyPrice = "";

        if (item.price) {
            const growLeftPad = 6;
            beautyPrice = leftPad(formatGrow(item.grow), growLeftPad)
                + " "
                + leftPad(formatGrow(item.accumulatedGrow), growLeftPad);
        }

        const columnName = item.diff + " g/tg, %";
        row[columnName] = beautyPrice;
    }

    return row;
}

function formatFactor(number) {
    return number.toFixed(1) + "x";
}


function pricesToTableRow2(prices, balance) {
    const balanceEnhanced = {};
    for (const item of balance) {
        balanceEnhanced[item.currency] = (item.available + item.reserved);
    }

    const row = {}

    const priceLeftPad = prices
        .map(item => balanceEnhanced[item.fromCurrency].toFixed(5))
        .map(coins => (coins + '').length)
        .reduce((a, b) => Math.max(a, b), 1);

    let isFirst = true;
    for (const item of prices) {
        if (isFirst) {
            isFirst = false;
            continue;
        }
        row['currency'] = item.fromCurrency;
        row['coins'] = leftPad(balanceEnhanced[item.fromCurrency].toFixed(5), priceLeftPad);
        let beautyPrice = "";

        if (item.price) {
            const growLeftPad = 6;
            beautyPrice = leftPad(formatFactor(item.factor), growLeftPad)
                + " "
                + leftPad(formatFactor(item.accumulatedFactor), growLeftPad);
        }

        const columnName = item.diff + " g/tg, %";
        row[columnName] = beautyPrice;
    }

    return row;
}

async function main() {
    try {
        const balance = await getHitBtcBalance();
        const currencies = balance.map(i => i.currency).filter(c => c !== primaryCurrency);
        const currenciesPrices = await Promise.all(currencies.map(getPricesAtKeyPoints));
        const table = currenciesPrices.map(prices => pricesToTableRow(prices, balance));
        console.table(orderBy(table, ['coins'], 'desc'));
        const table2 = currenciesPrices.map(prices => pricesToTableRow2(prices, balance));
        console.table(orderBy(table2, ['coins'], 'desc'));
    } catch (e) {
        prettyWrite(e);
    }
}

main();