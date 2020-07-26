'use strict';

const SMNCall = require('./smn-call');

const formatSubStation = require('./formatters/substation');
const formatWeather = require('./formatters/weather');

const calculateDistance = require('./helpers/calculate-distance');

module.exports = class WeatherArg {

	static noCache(value = true) {
		this._noCache = !!value;
	}

	static frequency(minutes = 30) {
		this._frequency = minutes;
	}

	static async getWeatherNow() {

		if(!this._frequency)
			this.frequency();

		const lastGet = this.lastUpdate ? (new Date() - this.lastUpdate) / 60000 : 0;

		if(!this._weatherNow || !this._noCache || lastGet > this._frequency) {
			this._weatherNow = await SMNCall.getWeatherNow();
			this.lastUpdate = new Date();
		}

		return this._weatherNow;
	}

	static async getProvinces() {

		const subStations = await this.getWeatherNow();
		const provinces = subStations.map(({ province }) => province);

		return [...new Set(provinces)];
	}

	// Substations Info

	static getSubStations() {
		return this.get(formatSubStation);
	}

	static getSubStationsByProvince(provinceName) {
		return this.getByProvince(provinceName, formatSubStation);
	}

	static getSubStationsByName(stationName) {
		return this.getByName(stationName, formatSubStation);
	}

	static getSubStationsById(id) {
		return this.getById(id, formatSubStation);
	}

	static getSubStationsByCoordinates(latitude, longitude) {
		return this.getByCoordinates(latitude, longitude, formatSubStation);
	}

	// Weather Info

	static getWeathers() {
		return this.get(formatWeather);
	}

	static getWeathersByProvince(provinceName) {
		return this.getByProvince(provinceName, formatWeather);
	}

	static getWeathersByName(stationName) {
		return this.getByName(stationName, formatWeather);
	}

	static getWeathersById(id) {
		return this.getById(id, formatWeather);
	}

	static getWeathersByCoordinates(latitude, longitude) {
		return this.getByCoordinates(latitude, longitude, formatWeather);
	}

	// Generic getters

	static async get(formatter) {
		const subStations = await this.getWeatherNow();
		return subStations.map(formatter);
	}

	static async getByProvince(provinceName, formatter) {

		if(typeof provinceName !== 'string' || !provinceName)
			throw new Error('Province Name must be a String and non empty');

		const subStations = await this.getWeatherNow();

		return subStations
			.filter(({ province }) => province.toUpperCase() === provinceName.toUpperCase())
			.map(formatter);
	}

	static async getByName(stationName, formatter) {

		if(typeof stationName !== 'string' || !stationName)
			throw new Error('SubStation Name must be a String and non empty');

		const subStations = await this.getWeatherNow();

		return subStations
			.filter(({ name }) => name.toUpperCase() === stationName.toUpperCase())
			.map(formatter);
	}

	static async getById(id, formatter) {

		if(typeof id !== 'number')
			throw new Error('SubStation Name must be a number');

		const subStations = await this.getWeatherNow();

		const [substation] = subStations
			.filter(({ lid }) => lid === id)
			.map(formatter);

		return substation;
	}

	static async getByCoordinates(latitude, longitude, formatter) {

		if(typeof latitude !== 'string')
			throw new Error('SubStation latitude must be a string');

		if(typeof longitude !== 'string')
			throw new Error('SubStation longitude must be a string');

		const subStations = await this.getWeatherNow();

		const { closestStation: substation } = subStations
			.reduce(({ closestStation, distance }, station) => {

				const newDistance = calculateDistance([latitude, longitude], [station.lat, station.lon]);

				if(Number.isNaN(Number(distance)) || newDistance < distance)
					return { closestStation: formatter(station), distance: newDistance };

				return { closestStation, distance };

			}, {});

		return substation;
	}
};
