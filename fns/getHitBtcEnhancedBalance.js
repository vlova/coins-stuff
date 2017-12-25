const { getCryptoCompareExchangeRates } = require("../apis/cryptocompare");
const { getHitBtcBalance, getHitBtcExchangeRates } = require("../apis/hitbtc");
const { primaryCurrency } = require("../common/config");

async function getHitBtcEnhancedBalance() {
    const [balance, hitBtcExchangeRates] = await Promise.all([getHitBtcBalance(), getHitBtcExchangeRates()]);
    const cryptoCompareExchangeRates = await getCryptoCompareExchangeRates(balance.map(i => i.currency));

    function getHitBtcRate(currency, key) {
        if (currency === primaryCurrency) return 1;

        if (hitBtcExchangeRates[currency] == null) {
            console.log(currency);
            return NaN;
        }

        let exchangeRate = hitBtcExchangeRates[currency][primaryCurrency];
        if (exchangeRate === undefined) {
            let bestRate = 0;
            for (let secondaryCurrency of Object.keys(hitBtcExchangeRates[currency])) {
                const subRate = hitBtcExchangeRates[currency][secondaryCurrency][key];
                const inPrimaryRate = subRate * getHitBtcRate(secondaryCurrency, key);
                bestRate = Math.max(inPrimaryRate || 0, bestRate);
            }
            return bestRate;
        }

        return parseFloat(exchangeRate[key]);
    }

    return balance.map(item => {
        let hitBtcRealRate = getHitBtcRate(item.currency, 'bid');
        let hitBtcSpeculativeRate = getHitBtcRate(item.currency, 'ask');
        let cryptoCompareRate = item.currency === primaryCurrency
            ? 1
            : (cryptoCompareExchangeRates[item.currency] || {})[primaryCurrency] || 0;

        let exampleItem = {
            availableInUsd: item.available,
            reservedInUsd: item.reserved,
            totalInUsd: (item.available + item.reserved)
        };

        function getItemByRate(item, rate) {
            return {
                rate,
                availableInUsd: item.availableInUsd * rate,
                reservedInUsd: item.reservedInUsd * rate,
                totalInUsd: item.totalInUsd * rate
            };
        }

        return {
            ...item,
            exchanged: {
                hitBtcReal: getItemByRate(exampleItem, hitBtcRealRate),
                hitBtcSpeculative: getItemByRate(exampleItem, hitBtcSpeculativeRate),
                cryptoCompare: getItemByRate(exampleItem, cryptoCompareRate)
            }
        }
    });
}

module.exports = {
    getHitBtcEnhancedBalance
}