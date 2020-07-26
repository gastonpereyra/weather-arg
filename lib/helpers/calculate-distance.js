'use strict';

module.exports = (
	[latitude, longitude],
	[lat, lon]
) => Math.abs(parseFloat(latitude) - parseFloat(lat)) + Math.abs(parseFloat(longitude) - parseFloat(lon));
