import { Auth, Errors, Okta, ReactQuery } from '../common';

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

const silentAuthFn = async ({ dispatch, oktaAuth, options }) => {
	try {
		const {
			hasSession: _hasSession,
			isAuthenticated: _isAuthenticated,
			update = true,
		} = options || {};

		const config = {};

		let isAuthenticated = _isAuthenticated;
		let authState = {};

		// If are not sure if the user is already authenticated, double check.
		if (_isAuthenticated === undefined) {
			// Checks if we can get tokens using either a refresh_token or, if our tokens are expired, if getWithoutPrompt works.
			isAuthenticated = await oktaAuth.isAuthenticated();
		}

		let result = { type: 'SILENT_AUTH_SUCCESS' };

		if (!isAuthenticated) {
			const hasSession = _hasSession || (await oktaAuth.session.exists());

			if (hasSession) {
				// Have a session but no tokens in tokenManager.
				// ** Hail Mary attempt to authenticate via existing session. **

				const { tokens } = await oktaAuth.token.getWithoutPrompt(config);

				if (tokens) {
					await oktaAuth.tokenManager.setTokens(tokens);

					result.payload = { isAuthenticated };

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
		throw new Errors.AppError({ type: 'SILENT_AUTH_ERROR', error });
	}
};

const signInWithRedirectFn = async ({ oktaAuth, options }) => {
	const { idp } = options || {};

	if (idp) {
		options = {
			...options,
			idp: idpMap[idp],
		};
	}

	return await oktaAuth.signInWithRedirect(options);
};

const loginFn = async ({ dispatch, oktaAuth: _oktaAuth, options }) => {
	try {
		const { authState, oktaAuth } = _oktaAuth;
		const { idp, isSignUp = false, loginhint } = options || {};

		if (idp) {
			return await signInWithRedirectFn({ dispatch, oktaAuth, options });
		}

		if (oktaAuth.isLoginRedirect()) {
			await oktaAuth.handleLoginRedirect();

			return dispatch({ type: 'LOGIN_SUCCESS' });
		}

		if (!authState?.isAuthenticated) {
			oktaAuth.setOriginalUri(window.location.href);

			const hasSession = await oktaAuth.session.exists();

			if (!hasSession) {
				const loginHint = isSignUp ? 'signup' : loginhint;

				return await signInWithRedirectFn({ dispatch, oktaAuth, options: { idp, loginHint } });
			}

			return await silentAuthFn({ dispatch, oktaAuth, options: { hasSession } });
		}
	} catch (error) {
		throw new Errors.AppError({ type: 'LOGIN_ERROR', error });
	}
};

export const useLoginMutation = options => {
	try {
		const oktaAuth = Okta.useOktaAuth();
		const dispatch = Auth.useAuthDispatch();

		return ReactQuery.useMutation(
			params => loginFn({ ...options, dispatch, oktaAuth, options: params }),
			{
				mutationKey: ['login'],
			}
		);
	} catch (error) {
		throw new Errors.AppError({
			message: 'useLoginMutation init error',
			type: 'LOGIN_MUTATION_INIT_FAILED',
			error,
		});
	}
};

export const silentAuth = silentAuthFn;
export const signInWithRedirect = signInWithRedirectFn;
