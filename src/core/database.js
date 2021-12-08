'use strict';

const DataFactory = require('@rnet.cf/datafactory');
const config = require('./config');

const dbString = config.mongo.dsn;

if (!dbString) {
	throw new Error('Missing environment variable CLIENT_MONGO_URL.');
}

const db = new DataFactory({
	dbString,
	disableReplica: config.mongo.disableReplica || false,
	logger: {
		level: config.logLevel || 'error',
		sentry: {
			level: config.sentry.logLevel,
			dsn: config.sentry.dsn,
		},
	},
});

module.exports = db;
