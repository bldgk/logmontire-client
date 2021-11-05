const axios = require('axios');

let url;

const logService = {
    init: function (config, callback) {
        url = config.url;
        callback()
    },
    get: function (callback) {
        axios.get(`${url}/get`)
            .then(r => {
                console.log(JSON.stringify(r.data));
                callback(r.data)
            })
    }
};

module.exports = logService;