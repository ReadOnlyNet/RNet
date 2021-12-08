'use strict';

const config = require('../core/config');
const logger = require('../core/logger');

const importedModules = {};
const loadedModules = {};

try { importedModules.Automod = require('@rnet.cf/automod').Automod; } catch (err) {}
try { importedModules.Autoroles = require('@rnet.cf/autoroles').Autoroles; } catch (err) {}
try { importedModules.CustomCommands = require('@rnet.cf/customcommands').CustomCommands; } catch (err) {}
try { importedModules.Manager = require('@rnet.cf/manager').Manager; } catch (err) {}
try { importedModules.Moderation = require('@rnet.cf/moderation').Moderation; } catch (err) {}
try { importedModules.Music = require('@rnet.cf/music').Music; } catch (err) {}
try { importedModules.Fun = require('@rnet.cf/fun').Fun; } catch (err) {}
try { var modules = require('@rnet.cf/modules'); } catch (err) {}

for (let [key, module] of Object.entries(importedModules)) {
	if (config.modules.includes(key)) {
		loadedModules[key] = module;
	}
}

if (modules) {
	for (let [key, module] of Object.entries(modules)) {
		if (config.modules.includes(key)) {
			loadedModules[key] = module;
		}
	}
}

module.exports = {
	hasModules: true,
	modules: loadedModules,
};
