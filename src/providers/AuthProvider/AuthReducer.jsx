import { _ } from '../../common';

const initialLoginState = {
	isPendingLogin: false,
	isLoggedOut: false,
};

export const initialState = {
	_initialized: false,
	isError: false,
	isAuthenticated: false,
	isLoading: true,
	isPendingLogout: false,
	errors: [],
	...initialLoginState,
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
					...initialLoginState,
					isLoading: false,
				};
				return _default();
			case 'LOGIN_CODE_EXCHANGE_STARTED':
				newState = {
					isPendingLogin: true,
				};
				return _default();
			case 'LOGOUT_STARTED':
				newState = {
					isPendingLogout: true,
					isLoading: true,
				};
				return _default();
			case 'LOGIN_SUCCESS':
				newState = {
					...initialLoginState,
					isAuthenticated: true,
					isLoading: false,
				};
				return _default();
			case 'LOGIN_WITH_REDIRECT_STARTED':
				newState = {
					isPendingLogin: true,
				};
				return _default();

			// LOGOUT
			case 'LOGOUT_SUCCEEDED':
				newState = {
					isPendingLogout: false,
					...initialLoginState,
					isLoggedOut: true,
				};
				return _default();

			// SILENT AUTH
			case 'SILENT_AUTH_ABORTED':
				newState = {
					...initialLoginState,
				};
				return _default();
			case 'SILENT_AUTH_STARTED':
				newState = {
					isPendingLogin: true,
				};
				return _default();
			case 'SILENT_AUTH_SUCCESS':
				newState = {
					...initialLoginState,
					isLoading: false,
				};
				return _default();

			// USER FETCH
			case 'USER_FETCH_STARTED':
			case 'USER_FETCH_ABORTED':
			case 'USER_INFO_FETCH_STARTED':
				return _default();
			case 'USER_FETCH_SUCCEEDED':
				newState = {
					...initialLoginState,
				};
				return _default();
			case 'USER_INFO_FETCH_SUCCEEDED':
				newState = {
					...initialLoginState,
				};
				return _default();

			// ERRORS
			case 'APP_STATE_UPDATE_FAILED':
			case 'LOGIN_ERROR':
			case 'LOGOUT_FAILED':
			case 'SILENT_AUTH_ERROR':
			case 'USER_FETCH_FAILED':
			case 'USER_INFO_FETCH_FAILED':
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
