// Habilitar modo estrito do Javascript
"use strict";

// Importar os módulos
var bot = require('./core.js')
var MACD = require('./indicators/macd.js')

var trader = bot.config.trader;

var init = function(){
	bot.balance(function(err, currency, asset){
		console.log("Iniciando o Bot");
		if (err) {
	 		return console.log(err)
	 	}
		
		// Selecionar os close dos candlesticks
		var candles = bot.getCandles()
		var candleArr = []
		for(var i in candles) {
			candleArr.push(candles[i].close)
		}

		// Enviar os closes para calcular o MACD
		candleArr = MACD.calculate( candleArr)

		console.log(candleArr);

		console.log("Saldo em %s: %s ", bot.config.watch.currency ,currency);
		console.log("Saldo em %s: %s ", bot.config.watch.asset ,asset);

					
		if (bot.lastPrice() > 900) {
			console.log("Last price %s: %s | Tendencia de alta - Buy: true | Sell: false", bot.getPair(), bot.lastPrice());	
		} else {
			console.log("Last price %s: %s | Tendencia de baixa - Buy: false | Sell: true", bot.getPair(), bot.lastPrice());
		}
	});
}



if (trader.enabled == true){
	bot.setCredential(bot.config.trader.key, bot.config.trader.secret);
	bot.setPair(bot.config.watch.currency + '_' + bot.config.watch.asset);
	
	// O BOT inicia em 5 segundos
	// Para ter tempo de pegar todas informações com ws socket
	var check = setInterval(
		function() {

			if( bot.lastPrice() > 0 &&  bot.getCandles().length > 0) {
				init(); clearInterval(check);
			}	
		}, 1000)
} else {
	console.log("Trader inativo > config.js > trader.enable: false");
}

