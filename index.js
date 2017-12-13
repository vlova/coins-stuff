const { computeTotalBalance } = require("./fns/computeTotalBalance");
const { getHitBtcEnhancedBalance } = require("./fns/getHitBtcEnhancedBalance");

async function main() {
    const balance = await getHitBtcEnhancedBalance();
    const totalBalance = computeTotalBalance(balance);
    console.log(balance);
    console.log(totalBalance);
}

main();