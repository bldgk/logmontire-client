const amqp = require('amqplib/callback_api');

let channel, exchange;

const rabbitmq = {
	init: function (config, callback) {
		amqp.connect(config.url, {useNewUrlParser: true}, function (err, conn) {
			if (err) console.log(err);
			conn.createChannel(function (err, ch) {
				channel = ch;
				exchange = "logs";
				ch.assertExchange(exchange, 'fanout', {durable: true});
				callback()
			});
		});
	},
	publish: function (message) {
		channel.publish(exchange, '', new Buffer(JSON.stringify(message)));
		console.log(" [x] Sent %s", message);
	},
	consume: function (callback) {
		channel.assertQueue('', {exclusive: true}, function (err, q) {
			console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q.queue);
			channel.bindQueue(q.queue, exchange, '');

			channel.consume(q.queue, function (message) {
				callback(JSON.parse(message.content.toString()))
			}, {noAck: true});
		});
	}
};

module.exports = rabbitmq;