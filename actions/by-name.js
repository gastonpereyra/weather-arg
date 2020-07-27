'use strict';

const WeatherArg = require('../lib/weather');

const [,, name] = process.argv;

const getWeather = async city => {
	console.log(await WeatherArg.getWeathersByName(city));
};

getWeather(name);
