const fetch = require("fetch").fetchUrl;
var throttledQueue = require('throttled-queue');
var throttle = throttledQueue(15, 1000); // at most 15 requests per second.


function getByUrl(url) {
    return new Promise(function (resolve, onError) {
        throttle(function () {
            fetch(url, {}, (error, meta, body) => {
                if (error != undefined) {
                    onError(error);
                    return;
                }

                try {
                    const bodyStr = body.toString();
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
    });
}

module.exports = {
    getByUrl
};