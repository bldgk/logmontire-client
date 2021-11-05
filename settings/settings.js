const fs = require('fs');
const path = require('path');

let config, dirName;

Object.byString = function (o, s) {
    s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    s = s.replace(/^\./, '');           // strip a leading dot
    let a = s.split('.');
    for (let i = 0, n = a.length; i < n; ++i) {
        let k = a[i];
        if (k in o) {
            o = o[k];
        } else {
            return;
        }
    }
    return o;
};

const settings = {
        init: (name) => {
            dirName = name;
            return this;
        },
        load: function (name, callback) {
            if (name) {
                this.init(name)
            }
            fs.readFile(path.join(dirName, 'config.json'), (err, data) => {
                if (err) throw err;
                config = JSON.parse(data.toString());
                callback(settings);
            });
        },
        get: (key) => {
            return Object.byString(config, key)
        }
    }
;

module.exports = settings;