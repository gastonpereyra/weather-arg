'use strict';

module.exports = class SMNCallError extends Error {

	constructor(message, status) {
		super();

		this.name = 'SMN-Call-Error';
		this.message = this.setMessage(message, status);
		this.status = status;
	}

	setMessage(message, status) {

		if(status >= 500)
			return `Server Error (${status}): ${message}`;

		return `Bad Request (${status}): ${message}`;
	}
};
