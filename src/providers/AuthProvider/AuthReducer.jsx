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
	profile: {},
	credentials: [],
	linkedUsers: [],
	userInfo: {},
};

export const initialState = {
	isError: false,
	isAuthenticated: false,
	isLoading: true,
	isPendingLogout: false,
	errors: [],
	...initialLoginState,
	...initialUserState,
};

export const getStoredUser = () => {
	const _user = sessionStorage.getItem('user');

	if (!_.isEmpty(_user)) {
		const user = _user !== null ? JSON.parse(_user) : {};

		if (!_.isEmpty(user)) {
			const { profile = {}, credentials = [], linkedUsers = [] } = user;

			if (user?._expires < Date.now()) {
				if (!_.isEmpty(user?.profile)) {
					delete user.profile;
				}

				if (!_.isEmpty(user?.credentials)) {
					delete user.credentials;
				}

				if (!_.isEmpty(user?.linkedUsers)) {
					delete user.linkedUsers;
				}

				return {
					profile: { ...user, ...profile },
					credentials,
					linkedUsers,
				};
			}
		}
	}

	return {};
};

const getStoredUserInfo = () => {
	const _userInfo = sessionStorage.getItem('userInfo');

	return _userInfo !== null ? JSON.parse(_userInfo) : {};
};

const getStoredUserState = () => {
	let userState = {};

	const user = getStoredUser();
	const userInfo = getStoredUserInfo();

	if (!_.isEmpty(user?.profile)) {
		userState = {
			...userState,
			...user,
			isPendingUserFetch: false,
			isStaleUserProfile: false,
		};

		if (!_.isEmpty(userInfo)) {
			userState = {
				...userState,
				userInfo,
				isPendingUserInfoFetch: false,
				isStaleUserInfo: false,
			};
		}
	}

	return userState;
};

export const initializeState = _initialState => {
	const state = { ..._initialState, _initialized: false };

	const _storedState = localStorage.getItem('app_state');
	const storedState = _storedState !== null ? JSON.parse(_storedState) : {};

	return { ...state, ...storedState };
};

const updateUserState = state => {
	const { isAuthenticated } = state || {};
	let userState = { ...state };

	if (isAuthenticated) {
		userState = {
			...userState,
			...getStoredUserState(),
		};
	} else {
		sessionStorage.clear();

		userState = {
			...userState,
			...initialUserState,
		};
	}

	return userState;
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

				newState = {
					...updateUserState(newState),
					isStaleUserInfo: true,
					isLoading: !!(state?._initialized && newState?.isAuthenticated),
				};

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
				};
				return _default();
			case 'LOGIN_SUCCESS':
				newState = {
					...initialLoginState,
					isAuthenticated: true,
					isStaleUserInfo: true,
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
			case 'LOGOUT_FAILED':
			case 'SILENT_AUTH_ERROR':
			case 'USER_FETCH_FAILED':
			case 'USER_INFO_FETCH_FAILED':
				console.error(action);
				newState = {
					...initialState,
					isLoading: false,
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
