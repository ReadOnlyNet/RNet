'use strict';

module.exports = function reloadcmds(rnet) {
        Loader.loadCommands(rnet);
        process.send({ op: 'resp', d: 'done' });
};