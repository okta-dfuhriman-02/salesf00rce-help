/* eslint-disable no-fallthrough */
/** @format */

import { _ } from '../../common';

export const initialState = {
	_initialized: false,
	isError: false,
	isAuthenticated: false,
	isLoading: true,
	errors: [],
};

export const AuthReducer = (state, action) => {
	try {
		const { type: message, payload = {}, error = {} } = action || {};

		const createState = ({ newState = {}, msg = message, state = {}, payload = {} }) => {
			const endState = { ...state, ...newState, ...payload };

			console.group('===== NEW STATE =====');
			console.log(JSON.stringify(endState, null, 2));
			console.groupEnd();

			return endState;
		};

		let newState = {};

		const _default = () => createState({ state, newState, payload });

		console.group('===== AUTH REDUCER =====');
		console.group('===== CURRENT STATE =====');
		console.log(JSON.stringify(state, null, 2));
		console.groupEnd();

		console.group(`===== ${action?.type} =====`);
		console.log(JSON.stringify(payload, null, 2));
		console.groupEnd();
		console.groupEnd();

		if (!_.isEmpty(error)) {
			console.group('===== ERROR =====');
			console.log(error);
			console.groupEnd();
		}

		switch (message) {
			case 'APP_INITIALIZED':
				newState = {
					_initialized: true,
					isLoading: false,
				};

				return _default();
			case 'AUTH_STATE_CHECK_STARTED':
				return _default();

			case 'AUTH_STATE_CHECKED':
			case 'AUTH_STATE_UPDATED':
				newState = {
					...state,
					...payload,
				};

				newState.isAuthenticated =
					newState?.authState?.isAuthenticated || newState?.isAuthenticated;

				return createState({ newState });

			// LOGIN
			case 'LOGIN_CANCELLED':
				newState = {
					isLoading: false,
				};
				return _default();
			case 'LOGIN_SUCCESS':
				newState = {
					isAuthenticated: true,
					isLoading: false,
				};
				return _default();

			// LOGOUT
			case 'LOGOUT_STARTED':
				newState = {
					isLoading: true,
				};
				return _default();
			case 'LOGOUT_SUCCEEDED':
				newState = {
					isLoggedOut: true,
				};
				return _default();

			// SILENT AUTH
			case 'SILENT_AUTH_SUCCESS':
				newState = {
					isLoading: false,
				};
				return _default();

			// ERRORS
			case 'APP_STATE_UPDATE_FAILED':
				console.error(action);
				newState = {
					...initialState,
					isLoading: false,
					...payload,
					...{
						error,
						isError: true,
					},
				};
				return createState({ newState });
			default:
				throw new Error(`Unhandled action type: ${action?.type}`);
		}
	} catch (error) {
		throw new Error(`authReducer error: [${error}]`);
	}
};
