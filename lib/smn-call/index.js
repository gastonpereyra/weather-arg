'use strict';

const fetch = require('node-fetch');
const SMNCallError = require('./smn-call-error');

const BASE_URL = 'https://ws.smn.gob.ar/';

const WEATHER_URL = 'map_items/weather';

module.exports = class SMNCall {

	static getWeatherNow() {
		return this.call(WEATHER_URL);
	}

	static async call(url) {

		const response = await fetch(BASE_URL + url);

		if(!response)
			new SMNCallError('Cannot Found Response');

		if(response.status >= 400)
			throw new SMNCallError(response.statusText, response.status);

		return response.json();
	}
};
