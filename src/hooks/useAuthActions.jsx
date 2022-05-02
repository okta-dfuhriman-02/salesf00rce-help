/** @format */
import { Okta } from '../common';

const GOOGLE_IDP_ID = '0oa3cdpdvdd3BHqDA1d7';
const LINKEDIN_IDP_ID = '0oa3cdljzgEyGBMez1d7';
const APPLE_IDP_ID = '';
const FACEBOOK_IDP_ID = '0oa3cdkzv0cGPFifd1d7';
const SALESFORCE_IDP_ID = '0oa3cdq1662ouS1uG1d7';

const idpMap = {
	google: GOOGLE_IDP_ID,
	linkedin: LINKEDIN_IDP_ID,
	apple: APPLE_IDP_ID,
	facebook: FACEBOOK_IDP_ID,
	salesforce: SALESFORCE_IDP_ID,
	[GOOGLE_IDP_ID]: 'google',
	[LINKEDIN_IDP_ID]: 'linkedin',
	[FACEBOOK_IDP_ID]: 'facebook',
	[SALESFORCE_IDP_ID]: 'salesforce',
};

const useAuthActions = () => {
	try {
		const { authState, oktaAuth } = Okta.useOktaAuth();

		const isAuthenticated = async dispatch => {
			const isAuthenticated = await oktaAuth.isAuthenticated();

			console.log('isAuthenticated:', isAuthenticated);

			dispatch({ type: 'AUTH_STATE_CHECKED', payload: { isAuthenticated } });

			return isAuthenticated;
		};

		const silentAuth = async (dispatch, options) => {
			try {
				const config = {};

				dispatch({ type: 'SILENT_AUTH_STARTED' });

				// Check if we can get tokens using either a refresh_token or, if our tokens are expired, if getWithoutPrompt works.
				const _isAuthenticated = await isAuthenticated(dispatch);

				let result = { type: 'SILENT_AUTH_ABORTED' };

				if (!_isAuthenticated) {
					const hasSession = options?.hasSession || (await oktaAuth.session.exists());

					if (hasSession) {
						// Have a session but no tokens in tokenManager.
						// ** Hail Mary attempt to authenticate via existing session. **

						if (!options) {
							config.redirectUri = `${window.location.origin}/login/callback`;
						}

						const { tokens } = await oktaAuth.token.getWithoutPrompt(config);

						if (tokens) {
							await oktaAuth.tokenManager.setTokens(tokens);

							await oktaAuth.authStateManager.updateAuthState();

							result = {
								type: 'SILENT_AUTH_SUCCESS',
							};
						}
					}
				}

				dispatch(result);

				return { isAuthenticated: _isAuthenticated };
			} catch (error) {
				if (dispatch) {
					console.log(error);
					dispatch({ type: 'SILENT_AUTH_ERROR', error });
				} else {
					throw new Error(error);
				}
			}
		};

		const getUserSync = async (userId, _user) => {
			let user = _user;

			const accessToken = oktaAuth.getAccessToken();
			const {
				payload: { uid: loggedInUserId },
			} = oktaAuth.token.decode(accessToken);

			const idToken = oktaAuth.getIdToken();
			const {
				payload: { idp },
			} = oktaAuth.token.decode(idToken);

			if (!user && userId) {
				const url = `${window.location.origin}/api/v1/users/${userId}`;

				const request = new Request(url);

				request.headers.append('Authorization', `Bearer ${accessToken}`);

				const response = await fetch(request);

				if (!response.ok) {
					const body = await response.json();
					console.error(body);
					throw new Error(JSON.stringify(body));
				}

				user = await response.json();
			}

			if (user) {
				// set active credential
				const { credentials = [] } = user;

				const _credentials = credentials.map(credential => {
					const {
						id,
						provider: { id: idpId, name },
					} = credential;

					const isLoggedIn =
						credentials.length === 1 ||
						(credentials.length === 2 && ['email', 'password'].includes(name)) ||
						(id === loggedInUserId && idpId === idp) ||
						(id === loggedInUserId && ['email', 'password'].includes(name));

					return { ...credential, isLoggedIn };
				});

				user = { ...user, credentials: _credentials };

				localStorage.setItem('user', JSON.stringify(user));

				return user;
			}
		};

		const getUser = async (dispatch, { userId, user: _user }) => {
			try {
				dispatch({
					type: 'USER_FETCH_STARTED',
				});

				const user = await getUserSync(userId, _user);

				const { profile = {}, credentials = [], linkedUsers = [] } = user || {};

				delete user.profile;
				delete user.credentials;
				delete user.linkedUsers;

				dispatch({
					type: 'USER_FETCH_SUCCEEDED',
					payload: { profile: { ...user, ...profile }, credentials, linkedUsers },
				});

				return user;
			} catch (error) {
				if (dispatch) {
					console.log(error);
					dispatch({
						type: 'USER_FETCH_FAILED',
						error,
					});
				} else {
					throw new Error(error);
				}
			}
		};

		const getUserInfoSync = async () => {
			const userInfo = await oktaAuth.getUser();

			if (userInfo) {
				if (userInfo.headers) {
					delete userInfo.headers;
				}

				localStorage.setItem('userInfo', JSON.stringify(userInfo));

				return userInfo;
			}
		};

		const getUserInfo = async dispatch => {
			try {
				if (dispatch) {
					dispatch({
						type: 'USER_INFO_FETCH_STARTED',
					});
				}

				const userInfo = await getUserInfoSync();

				if (dispatch) {
					dispatch({ type: 'USER_INFO_FETCH_SUCCEEDED', payload: { userInfo } });
				}
				return userInfo;
			} catch (error) {
				if (dispatch) {
					console.log(error);
					dispatch({ type: 'USER_INFO_FETCH_FAILED', error });
				} else {
					throw new Error(error);
				}
			}
		};

		const loginWithCredentials = async (dispatch, { username, password }) => {
			try {
				dispatch({ type: 'LOGIN_WITH_CREDENTIALS_STARTED' });

				oktaAuth
					.signInWithCredentials({ username, password, sendFingerprint: true })
					.then(async transaction => {
						if (transaction.status === 'SUCCESS') {
							oktaAuth.signInWithRedirect({ sessionToken: transaction.sessionToken });
						}
					});
			} catch (error) {
				if (dispatch) {
					dispatch({ type: 'LOGIN_ERROR', error });
				} else {
					throw new Error(error);
				}
			}
		};

		const signInWithRedirect = async (dispatch, options) => {
			const { idp } = options || {};

			if (dispatch) {
				dispatch({ type: 'LOGIN_WITH_REDIRECT_STARTED' });
			}

			if (idp) {
				options = {
					...options,
					idp: idpMap[idp],
				};
			}

			return await oktaAuth.signInWithRedirect(options);
		};

		const login = async (dispatch, props) => {
			try {
				const { username, password, idp, isSignUp = false } = props || {};
				// eslint-disable-next-line camelcase

				if (username && password) {
					return await loginWithCredentials(dispatch, { username, password });
				}

				if (idp) {
					return await signInWithRedirect(dispatch, idp);
				}

				if (oktaAuth.isLoginRedirect()) {
					dispatch({ type: 'LOGIN_PENDING' });

					await oktaAuth.handleLoginRedirect();

					dispatch({ type: 'LOGIN_SUCCESS' });

					return await getUserInfo(dispatch);
				}

				if (!authState?.isAuthenticated) {
					oktaAuth.setOriginalUri(window.location.href);

					const hasSession = await oktaAuth.session.exists();

					if (!hasSession) {
						const loginHint = isSignUp ? 'signup' : props?.loginhint;

						return await signInWithRedirect(dispatch, { idp, loginHint });
					}

					return await silentAuth(dispatch, { hasSession });
				}
			} catch (error) {
				if (dispatch) {
					dispatch({ type: 'LOGIN_ERROR', error });
				} else {
					throw new Error(error);
				}
			}
		};

		// const resetPassword = async (dispatch, { username, verificationCode }) => {
		// 	try {
		// 		const { status, nextStep: { inputs } } = await oktaAuth.idx.recoverPassword({ username, authenticators: ['okta_email'] });

		// 		const { status, nextStep: { inputs }} = await oktaAuth.idx.proceed({ verificationCode })

		// 	} catch (error) {
		// 		if (dispatch) {
		// 			dispatch({ type: actions.recovery.error.type, error });
		// 		} else {
		// 			throw new Error(error);
		// 		}
		// 	}

		// }

		const logout = (dispatch, postLogoutRedirect) => {
			let config = {};

			if (postLogoutRedirect) {
				config = { postLogoutRedirectUri: postLogoutRedirect };
			}
			dispatch({ type: 'LOGOUT_STARTED' });

			console.info('executing logout...');

			localStorage.removeItem('user');

			return oktaAuth.signOut(config).then(() => dispatch({ type: 'LOGOUT_SUCCEEDED' }));
		};

		const toggleSignUp = (dispatch, isSignUp) =>
			dispatch({
				type: 'LOGIN_INIT_SIGN_UP'.type,
				payload: { isSignUp: !isSignUp },
			});

		const toggleEmailAuth = (dispatch, { isRecovery, isSignUp, isEmailAuth }) => {
			if (isRecovery) {
				dispatch({
					type: 'LOGIN_INIT_WITH_EMAIL'.type,
					payload: { isRecovery: !isRecovery, isEmailAuth: false },
				});
			} else if (isSignUp) {
				dispatch({ type: 'LOGIN_INIT_SIGN_UP'.type, payload: { isEmailAuth: !isEmailAuth } });
			} else {
				dispatch({
					type: 'LOGIN_INIT_WITH_EMAIL'.type,
					payload: { isEmailAuth: !isEmailAuth },
				});
			}
		};

		return {
			getUserSync,
			getUser,
			getUserInfo,
			isAuthenticated,
			login,
			logout,
			signInWithRedirect,
			silentAuth,
			toggleEmailAuth,
			toggleSignUp,
		};
	} catch (error) {
		// console.error(`init error [${error}]`);
		throw new Error(`useAuthActions init error [${error}]`);
	}
};

export default useAuthActions;
