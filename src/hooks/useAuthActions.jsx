/** @format */
import { _, Okta } from '../common';
import { getStoredUser } from '../providers/AuthProvider/AuthReducer';

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

const useAuthActions = _oktaAuth => {
	try {
		const { authState, oktaAuth } = Okta.useOktaAuth() || { oktaAuth: _oktaAuth };

		const silentAuth = async (
			dispatch,
			{ hasSession: _hasSession, isAuthenticated: _isAuthenticated, update = true }
		) => {
			try {
				const config = {};

				let isAuthenticated = _isAuthenticated;
				let authState = {};

				// If are not sure if the user is already authenticated, double check.
				if (_isAuthenticated === undefined) {
					// Checks if we can get tokens using either a refresh_token or, if our tokens are expired, if getWithoutPrompt works.
					isAuthenticated = await oktaAuth.isAuthenticated();
				}

				let result = { type: 'SILENT_AUTH_ABORTED' };

				if (!isAuthenticated) {
					if (dispatch) {
						dispatch({ type: 'SILENT_AUTH_STARTED' });
					}

					const hasSession = _hasSession || (await oktaAuth.session.exists());

					if (hasSession) {
						// Have a session but no tokens in tokenManager.
						// ** Hail Mary attempt to authenticate via existing session. **

						const { tokens } = await oktaAuth.token.getWithoutPrompt(config);

						if (tokens) {
							await oktaAuth.tokenManager.setTokens(tokens);

							result = {
								type: 'SILENT_AUTH_SUCCESS',
								payload: { isAuthenticated },
							};

							if (update) {
								authState = await oktaAuth.authStateManager.updateAuthState();

								result.payload = { ...result.payload, authState };
							}
						}
					}
				}

				if (dispatch) {
					dispatch(result);
				}

				return { isAuthenticated };
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

				const _now = Date.now();
				const _expires = new Date(_now);

				user = {
					...user,
					credentials: _credentials,
					_expires: _expires.setMinutes(_expires.getMinutes() + 10),
				};

				sessionStorage.setItem('user', JSON.stringify(user));

				return user;
			}
		};

		const getUser = async (dispatch, { userId, user: _user, force = false }) => {
			try {
				dispatch({
					type: 'USER_FETCH_STARTED',
				});

				const storedUser = getStoredUser();

				let user = {};

				if (force || _.isEmpty(storedUser)) {
					user = await getUserSync(userId, _user);
				}

				const { profile = {}, credentials = [], linkedUsers = [] } = user || {};

				delete user.profile;
				delete user.credentials;
				delete user.linkedUsers;

				const payload = { profile: { ...user, ...profile }, credentials, linkedUsers };

				dispatch({
					type: 'USER_FETCH_SUCCEEDED',
					payload,
				});

				return payload;
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

				sessionStorage.setItem('userInfo', JSON.stringify(userInfo));

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
					dispatch({ type: 'LOGIN_CODE_EXCHANGE_STARTED' });

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

		const logout = async (dispatch, { userId, slo = true, postLogoutRedirect }) => {
			try {
				let config = {};

				if (postLogoutRedirect) {
					config = { postLogoutRedirectUri: postLogoutRedirect };
				}
				dispatch({ type: 'LOGOUT_STARTED' });

				console.info('executing logout...');

				// 1) Clear Idp sessions and revoke all tokens
				if (slo && userId) {
					const url = `${window.location.origin}/api/v1/users/${userId}/sessions`;

					const response = await fetch(url, { method: 'DELETE' });

					if (!response.ok) {
						throw new Error('Unable to clear user sessions!');
					}
				}

				// 2) Clear Session Storage
				sessionStorage.clear();

				// 3) Do Okta Sign Out, which results in a redirect.
				return oktaAuth.signOut(config);
			} catch (error) {
				if (dispatch) {
					console.log(error);
					dispatch({ type: 'LOGOUT_FAILED', error });
				} else {
					throw new Error(error);
				}
			}
		};

		return {
			getUserSync,
			getUser,
			getUserInfo,
			login,
			logout,
			signInWithRedirect,
			silentAuth,
		};
	} catch (error) {
		throw new Error(`useAuthActions init error [${error}]`);
	}
};

export default useAuthActions;
