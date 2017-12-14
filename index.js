const { computeTotalBalance } = require("./fns/computeTotalBalance");
const { getHitBtcEnhancedBalance } = require("./fns/getHitBtcEnhancedBalance");
const { prettyWrite } = require("./common/helpers");
const { orderBy } = require("lodash");

async function main() {
    const balance = await getHitBtcEnhancedBalance();
    const totalBalance = computeTotalBalance(balance);

    prettyWrite(orderBy(balance.map(i => ({
        currency: i.currency,
        inUsd: i.exchanged.hitBtcReal.totalInUsd,
        inUsd2: i.exchanged.cryptoCompare.totalInUsd
    })), ['inUsd'], ['desc']));

    console.log();

    prettyWrite({
        totalInUsd: totalBalance.hitBtcReal.totalInUsd,
        totalInUsd2: totalBalance.cryptoCompare.totalInUsd
    });
}

main();