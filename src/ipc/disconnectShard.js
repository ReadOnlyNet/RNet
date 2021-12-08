'use strict';

module.exports = function disconnectShard(rnet, config, message) {
	const client = rnet.client,
		id = parseInt(message.d),
		shard = client.shards.get(id);

	if (!shard) return;

	shard.disconnect({ reconnect: false });
};
