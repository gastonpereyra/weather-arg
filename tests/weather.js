'use strict';

const assert = require('assert');
const sinon = require('sinon');

const WeatherArg = require('../lib/weather');
const SMNCall = require('../lib/smn-call');

describe('Weather Argentina', () => {

	const rawSubStation = {
		_id: '5bbbc16659879ccdbfbfffd8',
		dist: 94.83,
		lid: 9949,
		fid: 9949,
		int_number: 87715,
		name: 'Cutral Co',
		province: 'Neuquén',
		lat: '-38.93712234',
		lon: '-69.22969055',
		zoom: '2',
		updated: 1595808000,
		weather: {
			humidity: 62,
			pressure: 982.1,
			st: 5.2,
			visibility: 15,
			wind_speed: 14,
			id: 0,
			description: 'Despejado',
			temp: 7.8,
			wing_deg: 'Oeste',
			tempDesc: '7.8ºC'
		},
		forecast: {
			_id: '598b871ff9a90f9a3d470768',
			timestamp: '1595800502120',
			date_time: '2019-05-08 18:00',
			location_id: 9949,
			forecast: {
				0: {
					date: '2019-05-08',
					temp_min: null,
					temp_max: null,
					temp_min_sub: null,
					temp_noc: 20,
					radiation: null,
					morning: {
						weather_id: 13,
						description: 'Cielo nublado'
					},
					afternoon: {
						weather_id: 13,
						description: 'Cielo nublado'
					}
				}
			}
		}
	};

	const resetWeather = () => {
		// eslint-disable-next-line no-underscore-dangle
		WeatherArg._frequency = undefined;
		WeatherArg.lastUpdate = undefined;
		// eslint-disable-next-line no-underscore-dangle
		WeatherArg._weatherNow = undefined;
	};

	afterEach(() => {
		sinon.restore();
		resetWeather();
	});

	describe('Set Frenquency', () => {

		it('Should set frequency in 30 minutes', () => {

			WeatherArg.frequency();

			// eslint-disable-next-line no-underscore-dangle
			assert.strictEqual(WeatherArg._frequency, 30);
		});

		it('Should set frequency in 0 minutes', () => {

			WeatherArg.frequency(0);

			// eslint-disable-next-line no-underscore-dangle
			assert.strictEqual(WeatherArg._frequency, 0);
		});

		it('Should reject if frequency is negative minutes', () => {
			assert.throws(() => WeatherArg.frequency(-10));
		});

		it('Should reject if frequency is not a number', () => {
			assert.throws(() => WeatherArg.frequency('10'));
		});
	});

	describe('Get Weather Now', () => {

		it('Should get Weather, set default frequency and lastUpdate', async () => {

			sinon.stub(SMNCall, 'getWeatherNow').returns([rawSubStation]);

			assert.deepStrictEqual(await WeatherArg.getWeatherNow(), [rawSubStation]);
			// eslint-disable-next-line no-underscore-dangle
			assert.strictEqual(WeatherArg._frequency, 30);
			assert(WeatherArg.lastUpdate);

			sinon.assert.calledOnce(SMNCall.getWeatherNow);
		});

		it('Should get Weather but call only once SMN-Call if frequency is in range', async () => {

			sinon.stub(SMNCall, 'getWeatherNow').returns([rawSubStation]);

			assert.deepStrictEqual(await WeatherArg.getWeatherNow(), [rawSubStation]);
			assert.deepStrictEqual(await WeatherArg.getWeatherNow(), [rawSubStation]);

			sinon.assert.calledOnce(SMNCall.getWeatherNow);
		});

		it('Should get Weather but call twice SMN-Call if frequency is 0', async () => {

			sinon.stub(SMNCall, 'getWeatherNow').returns([rawSubStation]);
			WeatherArg.frequency(0);

			assert.deepStrictEqual(await WeatherArg.getWeatherNow(), [rawSubStation]);
			assert.deepStrictEqual(await WeatherArg.getWeatherNow(), [rawSubStation]);

			sinon.assert.calledTwice(SMNCall.getWeatherNow);
		});

		it('Should get Weather but call twice SMN-Call if frequency is not in range', async () => {

			sinon.stub(SMNCall, 'getWeatherNow').returns([rawSubStation]);
			WeatherArg.frequency(1);

			assert.deepStrictEqual(await WeatherArg.getWeatherNow(), [rawSubStation]);

			WeatherArg.lastUpdate = (new Date()) - 100000;

			assert.deepStrictEqual(await WeatherArg.getWeatherNow(), [rawSubStation]);

			sinon.assert.calledTwice(SMNCall.getWeatherNow);
		});
	});

	describe('Get Provinces', () => {

		it('Should get all provinces found', async () => {

			sinon.stub(SMNCall, 'getWeatherNow').returns([rawSubStation]);

			assert.deepStrictEqual(await WeatherArg.getProvinces(), [rawSubStation.province]);

			sinon.assert.calledOnce(SMNCall.getWeatherNow);
		});

		it('Should get all provinces found wihtout duplicates', async () => {

			sinon.stub(SMNCall, 'getWeatherNow').returns([rawSubStation, rawSubStation]);

			assert.deepStrictEqual(await WeatherArg.getProvinces(), [rawSubStation.province]);

			sinon.assert.calledOnce(SMNCall.getWeatherNow);
		});
	});

	describe('Get Substations', () => {

		const subStationFormatted = {
			distanceFromStation: 94.83,
			id: 9949,
			forecastId: 9949,
			name: 'Cutral Co',
			province: 'Neuquén',
			latitude: '-38.93712234',
			longitude: '-69.22969055',
			lastUpdate: new Date(1595808000 * 1000)
		};

		describe('All', () => {

			it('Should return all substation formatted', async () => {

				sinon.stub(SMNCall, 'getWeatherNow').returns([rawSubStation]);

				assert.deepStrictEqual(await WeatherArg.getSubStations(), [subStationFormatted]);

				sinon.assert.calledOnce(SMNCall.getWeatherNow);
			});
		});

		describe('By Province', () => {

			it('Should return all substation formatted', async () => {

				sinon.stub(SMNCall, 'getWeatherNow').returns([rawSubStation]);

				assert.deepStrictEqual(await WeatherArg.getSubStationsByProvince(rawSubStation.province), [subStationFormatted]);

				sinon.assert.calledOnce(SMNCall.getWeatherNow);
			});

			it('Should return empty if no match', async () => {

				sinon.stub(SMNCall, 'getWeatherNow').returns([rawSubStation]);

				assert.deepStrictEqual(await WeatherArg.getSubStationsByProvince('other'), []);

				sinon.assert.calledOnce(SMNCall.getWeatherNow);
			});

			it('Should reject if no province is passed', async () => {

				await assert.rejects(WeatherArg.getSubStationsByProvince());
			});

			it('Should reject if province is not a string', async () => {

				await assert.rejects(WeatherArg.getSubStationsByProvince(1));
			});
		});

		describe('By Name', () => {

			it('Should return all substation formatted', async () => {

				sinon.stub(SMNCall, 'getWeatherNow').returns([rawSubStation]);

				assert.deepStrictEqual(await WeatherArg.getSubStationsByName(rawSubStation.name), [subStationFormatted]);

				sinon.assert.calledOnce(SMNCall.getWeatherNow);
			});

			it('Should return empty if no match', async () => {

				sinon.stub(SMNCall, 'getWeatherNow').returns([rawSubStation]);

				assert.deepStrictEqual(await WeatherArg.getSubStationsByName('other'), []);

				sinon.assert.calledOnce(SMNCall.getWeatherNow);
			});

			it('Should reject if no name is passed', async () => {

				await assert.rejects(WeatherArg.getSubStationsByName());
			});

			it('Should reject if name is not a string', async () => {

				await assert.rejects(WeatherArg.getSubStationsByName(1));
			});
		});

		describe('By Id', () => {

			it('Should return substation formatted', async () => {

				sinon.stub(SMNCall, 'getWeatherNow').returns([rawSubStation]);

				assert.deepStrictEqual(await WeatherArg.getSubStationsById(rawSubStation.lid), subStationFormatted);

				sinon.assert.calledOnce(SMNCall.getWeatherNow);
			});

			it('Should return empty if no match', async () => {

				sinon.stub(SMNCall, 'getWeatherNow').returns([rawSubStation]);

				assert.deepStrictEqual(await WeatherArg.getSubStationsById(1), undefined);

				sinon.assert.calledOnce(SMNCall.getWeatherNow);
			});

			it('Should reject if no id is passed', async () => {

				await assert.rejects(WeatherArg.getSubStationsById());
			});

			it('Should reject if id is not a number', async () => {

				await assert.rejects(WeatherArg.getSubStationsById('1'));
			});
		});

		describe('By Coordinates', () => {

			it('Should return substation formatted with exact coords', async () => {

				sinon.stub(SMNCall, 'getWeatherNow').returns([rawSubStation]);

				assert.deepStrictEqual(await WeatherArg.getSubStationsByCoordinates(rawSubStation.lat, rawSubStation.lon), subStationFormatted);

				sinon.assert.calledOnce(SMNCall.getWeatherNow);
			});

			it('Should return closest substation', async () => {

				sinon.stub(SMNCall, 'getWeatherNow').returns([rawSubStation, { lat: 1000, lon: 1000 }]);

				assert.deepStrictEqual(await WeatherArg.getSubStationsByCoordinates('1', '1'), subStationFormatted);

				sinon.assert.calledOnce(SMNCall.getWeatherNow);
			});

			it('Should reject if latitud is not string', async () => {

				await assert.rejects(WeatherArg.getSubStationsByCoordinates(undefined, '1'));
			});

			it('Should reject if longitude is not string', async () => {

				await assert.rejects(WeatherArg.getSubStationsByCoordinates('1'));
			});
		});
	});

	describe('Get Weather', () => {

		const weatherFormatted = {
			id: 9949,
			name: 'Cutral Co',
			province: 'Neuquén',
			lastUpdate: new Date(1595808000 * 1000),
			humidity: 62,
			pressure: 982.1,
			st: 5.2,
			visibility: 15,
			windSpeed: 14,
			weatherId: 0,
			description: 'Despejado',
			temperature: 7.8,
			windDirection: 'Oeste',
			temperatureDescription: '7.8ºC'

		};

		describe('All', () => {

			it('Should return all substation weather formatted', async () => {

				sinon.stub(SMNCall, 'getWeatherNow').returns([rawSubStation]);

				assert.deepStrictEqual(await WeatherArg.getWeathers(), [weatherFormatted]);

				sinon.assert.calledOnce(SMNCall.getWeatherNow);
			});
		});

		describe('By Province', () => {

			it('Should return all substation weather formatted', async () => {

				sinon.stub(SMNCall, 'getWeatherNow').returns([rawSubStation]);

				assert.deepStrictEqual(await WeatherArg.getWeathersByProvince(rawSubStation.province), [weatherFormatted]);

				sinon.assert.calledOnce(SMNCall.getWeatherNow);
			});

			it('Should return empty if no match', async () => {

				sinon.stub(SMNCall, 'getWeatherNow').returns([rawSubStation]);

				assert.deepStrictEqual(await WeatherArg.getWeathersByProvince('other'), []);

				sinon.assert.calledOnce(SMNCall.getWeatherNow);
			});

			it('Should reject if no province is passed', async () => {

				await assert.rejects(WeatherArg.getWeathersByProvince());
			});

			it('Should reject if province is not a string', async () => {

				await assert.rejects(WeatherArg.getWeathersByProvince(1));
			});
		});

		describe('By Name', () => {

			it('Should return all substation weather formatted', async () => {

				sinon.stub(SMNCall, 'getWeatherNow').returns([rawSubStation]);

				assert.deepStrictEqual(await WeatherArg.getWeathersByName(rawSubStation.name), [weatherFormatted]);

				sinon.assert.calledOnce(SMNCall.getWeatherNow);
			});

			it('Should return empty if no match', async () => {

				sinon.stub(SMNCall, 'getWeatherNow').returns([rawSubStation]);

				assert.deepStrictEqual(await WeatherArg.getWeathersByName('other'), []);

				sinon.assert.calledOnce(SMNCall.getWeatherNow);
			});

			it('Should reject if no name is passed', async () => {

				await assert.rejects(WeatherArg.getWeathersByName());
			});

			it('Should reject if name is not a string', async () => {

				await assert.rejects(WeatherArg.getWeathersByName(1));
			});
		});

		describe('By Id', () => {

			it('Should return substation weather formatted', async () => {

				sinon.stub(SMNCall, 'getWeatherNow').returns([rawSubStation]);

				assert.deepStrictEqual(await WeatherArg.getWeathersById(rawSubStation.lid), weatherFormatted);

				sinon.assert.calledOnce(SMNCall.getWeatherNow);
			});

			it('Should return empty if no match', async () => {

				sinon.stub(SMNCall, 'getWeatherNow').returns([rawSubStation]);

				assert.deepStrictEqual(await WeatherArg.getWeathersById(1), undefined);

				sinon.assert.calledOnce(SMNCall.getWeatherNow);
			});

			it('Should reject if no id is passed', async () => {

				await assert.rejects(WeatherArg.getWeathersById());
			});

			it('Should reject if id is not a number', async () => {

				await assert.rejects(WeatherArg.getWeathersById('1'));
			});
		});

		describe('By Coordinates', () => {

			it('Should return substation weather formatted with exact coords', async () => {

				sinon.stub(SMNCall, 'getWeatherNow').returns([rawSubStation]);

				assert.deepStrictEqual(await WeatherArg.getWeathersByCoordinates(rawSubStation.lat, rawSubStation.lon), weatherFormatted);

				sinon.assert.calledOnce(SMNCall.getWeatherNow);
			});

			it('Should return closest substation weather', async () => {

				sinon.stub(SMNCall, 'getWeatherNow').returns([rawSubStation]);

				assert.deepStrictEqual(await WeatherArg.getWeathersByCoordinates('1', '1'), weatherFormatted);

				sinon.assert.calledOnce(SMNCall.getWeatherNow);
			});

			it('Should reject if latitud is not string', async () => {

				await assert.rejects(WeatherArg.getWeathersByCoordinates(undefined, '1'));
			});

			it('Should reject if longitude is not string', async () => {

				await assert.rejects(WeatherArg.getWeathersByCoordinates('1'));
			});
		});
	});
});
