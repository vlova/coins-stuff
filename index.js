const { computeTotalBalance } = require("./fns/computeTotalBalance");
const { getHitBtcEnhancedBalance } = require("./fns/getHitBtcEnhancedBalance");
const { prettyWrite, delay } = require("./common/helpers");
const { orderBy } = require("lodash");

async function main() {
    const balance = await getHitBtcEnhancedBalance();
    prettyWrite(orderBy(balance.map(i => ({
        currency: i.currency,
        inUsd: i.exchanged.hitBtcReal.totalInUsd,
        inUsd2: i.exchanged.cryptoCompare.totalInUsd
    })), ['inUsd'], ['desc']));

    console.log();
    console.log();

    while (true) {
        const balance = await getHitBtcEnhancedBalance();
        const totalBalance = computeTotalBalance(balance);

        prettyWrite({
            totalInUsd: totalBalance.hitBtcReal.totalInUsd,
            totalInUsd2: totalBalance.cryptoCompare.totalInUsd,
            date: new Date()
        });

        await delay(30 * 1000);

        console.log();
    }
}

main();