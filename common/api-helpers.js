const fetch = require("fetch").fetchUrl;
var throttledQueue = require('throttled-queue');
var throttle = throttledQueue(15, 1000); // at most 15 requests per second.


function getByUrl(url) {
    return new Promise(function (resolve, onError) {
        throttle(function () {
            try {
                fetch(url, {}, (error, meta, body) => {
                    if (error != undefined) {
                        onError(error);
                        return;
                    }

                    try {
                        const bodyStr = body.toString();
                        try {
                            resolve(JSON.parse(bodyStr));
                        }
                        catch (e) {
                            onError({
                                errorType: 'api: parse error',
                                innerError: e,
                                bodyStr: bodyStr
                            });
                        }
                    }
                    catch (e) {
                        onError({
                            errorType: 'api: reading error',
                            innerError: e
                        });
                    }
                })
            }
            catch (e) {
                onError({
                    errorType: 'api: request error',
                    innerError: e
                });
            }
        });
    });
}

module.exports = {
    getByUrl
};