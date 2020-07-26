'use strict';

const SMNCall = require('./smn-call');

const calculateDistance = ([latitude, longitude], [lat, lon]) => {
	return Math.abs(parseFloat(latitude) - parseFloat(lat)) + Math.abs(parseFloat(longitude) - parseFloat(lon));
};

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

	// Substations Info

	static async getProvinces() {

		const subStations = await this.getWeatherNow();
		const provinces = subStations.map(({ province }) => province);

		return [...new Set(provinces)];
	}

	static async getSubStations() {
		const subStations = await this.getWeatherNow();
		return subStations.map(this.formatSubStation);
	}

	static async getSubStationsByProvince(provinceName) {

		if(typeof provinceName !== 'string' || !provinceName)
			throw new Error('Province Name must be a String and non empty');

		const subStations = await this.getWeatherNow();

		return subStations
			.filter(({ province }) => province.toUpperCase() === provinceName.toUpperCase())
			.map(this.formatSubStation);
	}

	static async getSubStationsByName(stationName) {

		if(typeof stationName !== 'string' || !stationName)
			throw new Error('SubStation Name must be a String and non empty');

		const subStations = await this.getWeatherNow();

		return subStations
			.filter(({ name }) => name.toUpperCase() === stationName.toUpperCase())
			.map(this.formatSubStation);
	}

	static async getSubStationsById(id) {

		if(typeof id !== 'number')
			throw new Error('SubStation Name must be a number');

		const subStations = await this.getWeatherNow();

		const [substation] = subStations
			.filter(({ lid }) => lid === id)
			.map(this.formatSubStation);

		return substation;
	}

	static async getSubStationsByCoordinates(latitude, longitude) {

		if(typeof latitude !== 'string')
			throw new Error('SubStation latitude must be a string');

		if(typeof longitude !== 'string')
			throw new Error('SubStation longitude must be a string');

		const subStations = await this.getWeatherNow();

		const { closestStation: substation } = subStations
			.reduce(({ closestStation, distance }, station) => {

				const newDistance = calculateDistance([latitude, longitude], [station.lat, station.lon]);

				if(Number.isNaN(Number(distance)) || newDistance < distance)
					return { closestStation: this.formatSubStation(station), distance: newDistance };

				return { closestStation, distance };

			}, {});

		return substation;
	}

	static formatSubStation({
		dist: distanceFromStation,
		lid: id,
		fid: forecastId,
		name,
		province,
		lat: latitude,
		lon: longitude,
		updated
	}) {
		return {
			id,
			forecastId,
			name,
			province,
			latitude,
			longitude,
			lastUpdate: new Date(updated * 1000),
			distanceFromStation
		};
	}

	// Weather
};
