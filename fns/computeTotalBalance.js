function computeTotalBalance(balance) {
    var total = {}

    for (let item of balance) {
        for (let exchange of Object.keys(item.exchanged)) {
            for (let key of Object.keys(item.exchanged[exchange])) {
                if (key === 'rate') {
                    continue;
                }
                total[exchange] = total[exchange] || {};
                total[exchange][key] = (total[exchange][key] || 0) + item.exchanged[exchange][key];
            }
        }
    }

    return total;
}

module.exports = {
    computeTotalBalance
}