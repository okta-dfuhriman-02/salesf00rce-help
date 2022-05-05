import { _ } from '../../common';

const initialLoginState = {
	isPendingLogin: false,
	isLoggedOut: false,
};

const initialUserState = {
	isPendingUserFetch: false,
	isPendingUserInfoFetch: false,
	isStaleUserProfile: true,
	isStaleUserInfo: true,
};

export const initialState = {
	isError: false,
	isAuthenticated: false,
	isLoading: false,
	isPendingLogout: false,
	errors: [],
	...initialLoginState,
	...initialUserState,
};

export const initializeState = _initialState => {
	const state = { ..._initialState };

	const _storedState = localStorage.getItem('app_state');
	const storedState = _storedState !== null ? JSON.parse(_storedState) : {};

	if (_.isEmpty(storedState)) {
		const _userInfo = localStorage.getItem('userInfo');
		if (_userInfo !== null) {
			state.userInfo = JSON.parse(_userInfo);
		}

		const _user = localStorage.getItem('user');

		if (!_.isEmpty(_user)) {
			const user = _user !== null ? JSON.parse(_user) : {};
			const { profile = {}, credentials = [] } = user;

			delete user.profile;
			delete user.credentials;

			state.profile = { ...user, ...profile };
			state.credentials = credentials;
		}

		return state;
	}

	return { ...state, ...storedState };
};

const updateUserState = payload => {
	const { userInfo, profile, isAuthenticated } = payload || {};
	let userState = {};

	if (!isAuthenticated) {
		if (!_.isEmpty(userInfo)) {
			userState = {
				...userState,
				userInfo: {},
			};

			localStorage.removeItem('userInfo');
		}

		if (!_.isEmpty(profile)) {
			userState = {
				...userState,
				profile: {},
				credentials: {},
				linkedUsers: [],
			};

			localStorage.removeItem('user');
		}
	}
	return userState;
};

export const AuthReducer = (state, action) => {
	try {
		const { type: message, payload = {}, error = {} } = action || {};

		console.group('===== AUTH REDUCER =====');

		const createState = ({ newState = {}, msg = message, state = {}, payload = {} }) => {
			const endState = { ...state, ...newState, ...payload };

			console.group('===== NEW STATE =====');
			console.log(JSON.stringify(endState, null, 2));
			console.groupEnd();
			console.groupEnd();

			return endState;
		};

		let newState = {};

		const _default = () => createState({ state, newState, payload });

		console.group('===== CURRENT STATE =====');
		console.log(JSON.stringify(state, null, 2));
		console.groupEnd();

		console.group(`===== ${action?.type} =====`);
		console.log(JSON.stringify(payload, null, 2));
		console.groupEnd();

		if (!_.isEmpty(error)) {
			console.group('===== ERROR =====');
			console.log(error);
			console.groupEnd();
		}

		switch (message) {
			case 'APP_STATE_UPDATE_STARTED':
				newState = {
					isPendingUserFetch: true,
					isPendingUserInfoFetch: true,
				};
				return createState({ newState, payload });
			case 'APP_STATE_UPDATED':
				newState = {
					...state,
					...initialUserState,
					...payload,
				};

				if (!newState?.isAuthenticated) {
					if (!_.isEmpty(newState?.userInfo)) {
						localStorage.removeItem('userInfo');
						newState = { ...newState, userInfo: {} };
					}

					if (!_.isEmpty(newState?.profile)) {
						localStorage.removeItem('user');

						newState = { ...newState, credentials: [], profile: {}, linkedUsers: [] };
					}
				}

				if (!newState?.isPendingAccountLink) {
					newState = {
						...newState,
						isStaleUserInfo: true,
					};
				}
				return createState({ newState });

			case 'AUTH_STATE_CHECK_STARTED':
				return _default();

			case 'AUTH_STATE_CHECKED':
			case 'AUTH_STATE_UPDATED':
				newState = {
					...updateUserState(payload),
				};

				return _default();

			// LOGIN
			case 'LOGIN_CANCELLED':
				newState = {
					...initialLoginState,
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
				};
				return _default();
			case 'LOGIN_SUCCESS':
				newState = {
					...initialLoginState,
					isAuthenticated: true,
					isStaleUserInfo: true,
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
					...updateUserState(payload),
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
				};
				return _default();

			// USER FETCH
			case 'USER_FETCH_STARTED':
				newState = {
					isPendingUserFetch: true,
					isStaleUserProfile: false,
				};
				return _default();
			case 'USER_INFO_FETCH_STARTED':
				newState = {
					isPendingUserInfoFetch: true,
					isStaleUserInfo: false,
				};
				return _default();
			case 'USER_FETCH_SUCCEEDED':
				newState = {
					...initialLoginState,
					isPendingUserFetch: false,
				};
				return _default();
			case 'USER_INFO_FETCH_SUCCEEDED':
				newState = {
					...initialLoginState,
					isStaleUserProfile: true,
					isPendingUserInfoFetch: false,
				};
				return _default();

			// ERRORS
			case 'APP_STATE_UPDATE_FAILED':
			case 'LOGIN_ERROR':
			case 'SILENT_AUTH_ERROR':
			case 'USER_FETCH_FAILED':
			case 'USER_INFO_FETCH_FAILED':
				console.log('login error:', action);
				newState = {
					...initialState,
					...updateUserState(),
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
