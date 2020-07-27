'use strict';

const assert = require('assert');
const nock = require('nock');

const SMNCall = require('../lib/smn-call');

describe('SMN-Call', () => {

	describe('Call', () => {

		context('When Call fails', () => {

			const status40XSamples = [
				[400, 'Bad Request'],
				[401, 'Unauthorized'],
				[403, 'Forbidden'],
				[404, 'Not Found']
			];

			status40XSamples.forEach(([status, message]) => {
				it(`Should reject if calls status is ${status}`, async () => {

					nock('https://ws.smn.gob.ar/')
						.get('/example')
						.reply(status, {});

					await assert.rejects(SMNCall.call('example'), {
						name: 'SMN-Call-Error',
						message: `Bad Request (${status}): ${message}`,
						status
					});
				});
			});

			const status50XSamples = [
				[500, 'Internal Server Error'],
				[503, 'Service Unavailable']
			];

			status50XSamples.forEach(([status, message]) => {
				it(`Should reject if calls status is ${status}`, async () => {

					nock('https://ws.smn.gob.ar/')
						.get('/example')
						.reply(status, {});

					await assert.rejects(SMNCall.call('example'), {
						name: 'SMN-Call-Error',
						message: `Server Error (${status}): ${message}`,
						status
					});
				});
			});
		});

		context('When request is succesfull', () => {

			const samplesUrl = [
				['forecast ', { id: 'some id' }],
				['map_items/forecast/1', { id: 'some id' }],
				['alerts', { id: 'some id' }],
				['alerts/type/AL', { id: 'some id' }],
				['alerts/type/AC', { id: 'some id' }],
				['alerts/type/IE', { id: 'some id' }]
			];

			samplesUrl.forEach(([url, response]) => {
				it(`Should call url ${url} and return response object`, async () => {

					nock('https://ws.smn.gob.ar/')
						.get('/example')
						.reply(200, JSON.stringify(response));


					assert.deepStrictEqual(await SMNCall.call('example'), response);
				});
			});
		});
	});

	describe('Get Weather Now', () => {

		it('Should call url correctly', async () => {

			nock('https://ws.smn.gob.ar/')
				.get('/map_items/weather')
				.reply(200, JSON.stringify([{ id: 'some id' }]));

			assert.deepStrictEqual(await SMNCall.getWeatherNow(), [{ id: 'some id' }]);
		});
	});
});
