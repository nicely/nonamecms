var config = {};

config.local = require('./local');
config.production = require('./production');

module.exports = function (mode) {
    return config[mode || process.argv[2] || 'local'] || config.local;
};
