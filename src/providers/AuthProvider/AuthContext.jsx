/* eslint-disable react-hooks/exhaustive-deps */
/** @format */

import { Auth } from '../../common';

import { useNavigate } from 'react-router-dom';

import { PropTypes, React } from '../../common';
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';
import { Security } from '@okta/okta-react';
import { authConfig } from '../../common/config/authConfig';
import { AuthReducer, initialState, initializeState } from './AuthReducer';
import AuthDispatchContext from './AuthDispatcher';

export const AuthStateContext = React.createContext();

const oktaAuth = new OktaAuth(authConfig.oidc);

const AuthProvider = ({ children }) => {
	const navigate = useNavigate();
	const { getUserInfo, getUser, silentAuth } = Auth.useAuthActions(oktaAuth);
	const restoreOriginalUri = async (_oktaAuth, originalUri) =>
		navigate(toRelativeUrl(originalUri || '/', window.location.origin), { replace: true });

	const customAuthHandler = () => {
		navigate('/', { replace: true });
	};
	const [state, dispatch] = React.useReducer(AuthReducer, initialState, initializeState);

	React.useLayoutEffect(() => {
		const initAuthState = async () => {
			let isAuthenticated = (await oktaAuth.isAuthenticated()) || false;

			if (!isAuthenticated && !oktaAuth.isLoginRedirect) {
				isAuthenticated = await silentAuth(null, { isAuthenticated, update: false });
			}

			return isAuthenticated;
		};
		const handler = authState => dispatch({ type: 'AUTH_STATE_UPDATED', payload: { authState } });

		console.log('AuthContext > authStateManager.subscribe()');

		oktaAuth.authStateManager.subscribe(handler);

		console.log('AuthContext > initAuthState()');

		initAuthState().then(() => oktaAuth.start());

		return () => oktaAuth.authStateManager.unsubscribe();
	}, []);

	React.useEffect(() => {
		const {
			isAuthenticated,
			isPendingLogin,
			isPendingUserInfoFetch,
			isPendingUserFetch,
			isStaleUserInfo,
			isStaleUserProfile,
			profile,
			userInfo,
		} = state || {};

		if (isAuthenticated && (!oktaAuth.isLoginRedirect || !isPendingLogin)) {
			if (!isPendingUserInfoFetch) {
				if (isStaleUserInfo || !userInfo) {
					console.debug('Router > getUserInfo()');

					getUserInfo(dispatch);
				}

				if (userInfo?.sub && !isPendingUserFetch && (isStaleUserProfile || !profile)) {
					console.debug('Router > getUser()');

					getUser(dispatch, { userId: userInfo.sub });
				}
			}
		}
	}, [state]);

	// eslint-disable-next-line react/jsx-no-constructed-context-values
	const contextValues = {
		...state,
	};

	return (
		<AuthStateContext.Provider value={contextValues}>
			<Security
				oktaAuth={oktaAuth}
				restoreOriginalUri={restoreOriginalUri}
				onAuthRequired={customAuthHandler}
			>
				<AuthDispatchContext.Provider value={dispatch}>{children}</AuthDispatchContext.Provider>
			</Security>
		</AuthStateContext.Provider>
	);
};

AuthProvider.propTypes = {
	children: PropTypes.node,
};

export default AuthProvider;
