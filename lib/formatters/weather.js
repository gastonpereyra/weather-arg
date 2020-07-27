'use strict';

const formatWeahter = ({
	id: weatherId,
	description,
	temp: temperature,
	tempDesc: temperatureDescription,
	st,
	humidity,
	pressure,
	visibility,
	wind_speed: windSpeed,
	wing_deg: windDirection
}) => ({
	weatherId,
	description,
	temperature,
	temperatureDescription,
	st,
	humidity,
	pressure,
	windSpeed,
	windDirection,
	visibility
});

module.exports = ({
	lid: id,
	name,
	province,
	updated,
	weather
}) => ({
	id,
	name,
	province,
	lastUpdate: new Date(updated * 1000),
	...formatWeahter(weather)
});
