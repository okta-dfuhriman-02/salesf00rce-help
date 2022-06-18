export default class ApiError extends Error {
	constructor({ message, statusCode, json, type }) {
		super(message ?? 'ApiError');

		this.statusCode = statusCode;
		this.name = 'ApiError';
		this.json = json;
		this.type = type;
	}
}
