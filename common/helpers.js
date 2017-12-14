const prettyjson = require('prettyjson');

function prettyWrite(object) {
    console.log(prettyjson.render(object, {
        keysColor: 'grey',
        stringColor: 'green',
        numberColor: 'white'
    }));
}

module.exports = {
    prettyWrite
};