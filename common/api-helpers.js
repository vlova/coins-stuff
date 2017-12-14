const fetch = require("fetch").fetchUrl;

function getByUrl(url) {
    return new Promise(function (resolve, onError) {
        return fetch(url, {}, (error, meta, body) => {
            if (error != undefined) {
                onError(error);
                return;
            }

            const bodyStr = body.toString();
            try {
                resolve(JSON.parse(bodyStr));
            }
            catch (e) { 
                onError({
                    innerError: e,
                    bodyStr: bodyStr
                });
            }
        })
    });
}

module.exports = {
    getByUrl
};