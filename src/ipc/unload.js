'use strict';

module.exports = function unload(rnet, config, message) {
	try {
		const module = rnet.modules.find(m => m.name.toLowerCase() === message.d.name.toLowerCase());

		if (!module) {
			return process.send({ op: 'resp', d: `Invalid module.` });
		}

		module._unload();
		process.send({ op: 'resp', d: 'success' });
	} catch (err) {
		process.send({ op: 'resp', d: err });
	}
};
