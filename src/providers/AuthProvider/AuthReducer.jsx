/** @format */

import { _ } from '../../common';

const initialLoginFormState = {
	isSignUp: false,
	isEmailAuth: false,
	isRecovery: false,
};

const initialLoginState = {
	isPendingLogin: false,
	...initialLoginFormState,
};

const initialUserState = {
	isPendingUserFetch: false,
	isPendingUserInfoFetch: false,
	isStaleUserProfile: false,
	isStaleUserInfo: false,
};

const initializeState = () => {
	let state = {
		isError: false,
		isAuthenticated: false,
		isLoading: false,
		isLoadingLogout: false,
		isVisibleAppLauncher: false,

		errors: [],
		...initialLoginState,
		...initialUserState,
	};

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

export const initialState = {
	...initializeState(),
};

export const AuthReducer = (state, action) => {
	try {
		let tempState = {};
		console.debug('===== STATE =====');
		console.debug(JSON.stringify(state, null, 2));
		console.debug('===== ACTION =====');
		console.debug(JSON.stringify(action, null, 2));
		switch (action?.type) {
			case 'APP_STATE_UPDATE_STARTED':
				tempState = {
					isPendingUserFetch: true,
					isPendingUserInfoFetch: true,
				};

				return { ...state, ...tempState, ...action?.payload };
			case 'APP_STATE_UPDATED':
				tempState = {
					...state,
					...initialUserState,
					...action?.payload,
				};

				if (!tempState?.isAuthenticated) {
					if (!_.isEmpty(tempState?.userInfo)) {
						localStorage.removeItem('userInfo');
						tempState = { ...tempState, userInfo: {} };
					}

					if (!_.isEmpty(tempState?.profile)) {
						localStorage.removeItem('user');

						tempState = { ...tempState, credentials: [], profile: {}, linkedUsers: [] };
					}
				}

				if (!tempState?.isPendingAccountLink) {
					tempState = {
						...tempState,
						isStaleUserInfo: true,
					};
				}
				return tempState;

			case 'AUTH_STATE_UPDATED':
			case 'AUTH_STATE_CHECKED':
				return { ...state, ...action?.payload };

			// CREDENTIAL RECOVERY
			case 'RECOVERY_STARTED':
				return { ...state, ...tempState, ...action?.payload };
			case 'RECOVERY_SUCCEEDED':
				return { ...state, ...tempState, ...action?.payload };

			// LOGIN
			case 'LOGIN_CANCELLED':
				tempState = {
					...initialLoginState,
				};
				return { ...state, ...tempState, ...action?.payload };
			case 'LOGIN_INIT_WITH_EMAIL'.type:
				tempState = {
					...initialLoginFormState,
					isEmailAuth: true,
					content: {
						header: {
							headline: 'Login with your email',
							subheadline: "Enter your email address and we'll send you a single-use code.",
						},
						primaryCTA: 'Log In',
					},
				};
				return { ...state, ...tempState, ...action?.payload };
			case 'LOGIN_INIT_SIGN_UP'.type:
				tempState = {
					...initialLoginFormState,
					isSignUp: true,
					content: {
						header: {
							headline: 'Sign up with your email',
							subheadline: "Enter your email address and we'll send you a single-use code.",
						},
						primaryCTA: 'Sign Up',
					},
				};
				return { ...state, ...tempState, ...action?.payload };
			case 'LOGIN_INIT_RECOVERY'.type:
				tempState = {
					...initialLoginFormState,
					isRecovery: true,
					content: {
						header: {
							headline: "Can't log in?",
							subheadline: "Enter your email address and we'll get you back on the trail.",
						},
						primaryCTA: 'Send Verification Email',
					},
				};
				return { ...state, ...tempState, ...action?.payload };
			case 'LOGIN_PENDING':
				tempState = {
					isPendingLogin: true,
				};
				return { ...state, ...tempState, ...action?.payload };
			case 'LOGOUT_STARTED':
				tempState = {
					isLoadingLogout: true,
				};
				return { ...state, ...tempState, ...action?.payload };
			case 'LOGIN_SUCCESS':
				tempState = {
					...initialLoginState,
					isAuthenticated: true,
					isStaleUserInfo: true,
				};
				return { ...state, ...tempState, ...action?.payload };
			case 'LOGIN_WITH_REDIRECT_STARTED':
				tempState = {
					isPendingLogin: true,
				};
				return { ...state, ...tempState, ...action?.payload };

			// LOGOUT
			case 'LOGOUT_SUCCEEDED':
				tempState = {
					isLoadingLogout: false,
					...initialLoginState,
				};
				return { ...state, ...tempState, ...action?.payload };

			// SILENT AUTH
			case 'SILENT_AUTH_ABORTED':
				tempState = {
					...initialLoginState,
				};
				return { ...state, ...tempState, ...action?.payload };
			case 'SILENT_AUTH_STARTED':
				tempState = {
					isPendingLogin: true,
				};
				return { ...state, ...tempState, ...action?.payload };
			case 'SILENT_AUTH_SUCCESS':
				tempState = {
					...initialLoginState,
				};
				return { ...state, ...tempState, ...action?.payload };

			// USER FETCH
			case 'USER_FETCH_STARTED':
				tempState = {
					isPendingUserFetch: true,
					isStaleUserProfile: false,
				};

				return { ...state, ...tempState, ...action?.payload };
			case 'USER_INFO_FETCH_STARTED':
				tempState = {
					isPendingUserInfoFetch: true,
					isStaleUserInfo: false,
				};

				return { ...state, ...tempState, ...action?.payload };

			case 'USER_FETCH_SUCCEEDED':
				tempState = {
					...initialLoginState,
					isPendingUserFetch: false,
				};
				return { ...state, ...tempState, ...action?.payload };
			case 'USER_INFO_FETCH_SUCCEEDED':
				tempState = {
					...initialLoginState,
					isStaleUserProfile: true,
					isPendingUserInfoFetch: false,
				};

				return { ...state, ...tempState, ...action?.payload };

			// ERRORS
			case 'APP_STATE_UPDATE_FAILED':
			case 'LOGIN_ERROR':
			case 'SILENT_AUTH_ERROR':
			case 'USER_FETCH_FAILED':
			case 'USER_INFO_FETCH_FAILED':
				console.log('login error:', action);
				return {
					...state,
					...initialState,
					...action?.payload,
					...{
						error: action?.error,
						isError: true,
					},
				};
			default:
				throw new Error(`Unhandled action type: ${action?.type}`);
		}
	} catch (error) {
		throw new Error(`authReducer error: [${error}]`);
	}
};
