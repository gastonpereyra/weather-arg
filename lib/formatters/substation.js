'use strict';

module.exports = ({
	dist: distanceFromStation,
	lid: id,
	fid: forecastId,
	name,
	province,
	lat: latitude,
	lon: longitude,
	updated
}) => ({
	id,
	forecastId,
	name,
	province,
	latitude,
	longitude,
	lastUpdate: new Date(updated * 1000),
	distanceFromStation
});
