
const { prettyWrite } = require("./common/helpers");
const { getHitBtcTrades } = require("./apis/hitbtc");

async function main() {
    try {
        const trades = (await getHitBtcTrades()).map(item => ({
            symbol: item.symbol,
            side: item.side,
            quantity: item.quantity,
            price: item.price,
            fee: item.fee,
            timestamp: item.timestamp
        }));
        
        prettyWrite(trades);
    } catch (e) {
        prettyWrite(e);
    }
}

main();