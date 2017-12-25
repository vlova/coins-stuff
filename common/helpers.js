const prettyjson = require('prettyjson');

function prettyWrite(object) {
    console.log(prettyjson.render(object, {
        keysColor: 'grey',
        stringColor: 'green',
        numberColor: 'white'
    }));
}

function delay(ms) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(), ms);
    })
}

module.exports = {
    prettyWrite,
    delay
};