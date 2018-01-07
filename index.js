const { computeTotalBalance } = require("./fns/computeTotalBalance");
const { getHitBtcEnhancedBalance } = require("./fns/getHitBtcEnhancedBalance");
const { prettyWrite, delay } = require("./common/helpers");
const { orderBy } = require("lodash");

async function main() {
    try {
        const balance = await getHitBtcEnhancedBalance();
        prettyWrite(orderBy(balance.map(i => ({
            currency: i.currency,
            inUsd: i.exchanged.hitBtcReal.totalInUsd,
            inUsd2: i.exchanged.cryptoCompare.totalInUsd
        })), ['inUsd'], ['desc']));
    }
    catch (e) {
        console.error(e);
    }

    console.log();
    console.log();

    while (true) {
        try {
            const balance = await getHitBtcEnhancedBalance();
            const totalBalance = computeTotalBalance(balance);

            prettyWrite({
                totalInUsd: totalBalance.hitBtcReal.totalInUsd,
                totalInUsd2: totalBalance.cryptoCompare.totalInUsd,
                date: new Date()
            });
        }

        catch (e) {
            console.error(e);
        }

        await delay(30 * 1000);

        console.log();
    }
}

main().catch(e => console.error(e));