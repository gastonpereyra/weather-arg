'use strict';

const WeatherArg = require('./weather');

(async () => {

	console.log(await WeatherArg.getWeathers(4864));
})();
