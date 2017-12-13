var fetch = require("fetch").fetchUrl;

function getByUrl(url) {
    return new Promise(function (resolve, error) {
        return fetch(url, {}, (error, meta, body) => resolve(JSON.parse(body.toString())))
    });
}

module.exports = {
    getByUrl
};