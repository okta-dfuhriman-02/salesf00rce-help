export default class AppError extends Error {
	constructor({ message, type, error }) {
		super(message ?? 'AppError');

		this.type = type;
		this.name = 'AppError';
		this.error = error;
	}
}
