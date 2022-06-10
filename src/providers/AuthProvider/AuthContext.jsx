/* eslint-disable react-hooks/exhaustive-deps */
/** @format */
import { useNavigate } from 'react-router-dom';

import { Auth, PropTypes, React, ReactQuery, userInfoQueryFn } from '../../common';
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';
import { Security } from '@okta/okta-react';
import { authConfig } from '../../common/config/authConfig';
import { AuthReducer, initialState } from './AuthReducer';
import AuthDispatchContext from './AuthDispatcher';

export const AuthStateContext = React.createContext();

const oktaAuth = new OktaAuth(authConfig.oidc);

const AuthProvider = ({ children }) => {
	const queryClient = ReactQuery.useQueryClient();

	const navigate = useNavigate();
	const { silentAuth } = Auth.useAuthActions(oktaAuth);

	const restoreOriginalUri = async (_oktaAuth, originalUri) =>
		navigate(toRelativeUrl(originalUri || '/', window.location.origin), { replace: true });

	const customAuthHandler = () => {
		navigate('/', { replace: true });
	};

	const [state, dispatch] = React.useReducer(AuthReducer, initialState);

	React.useLayoutEffect(() => {
		const initAuthState = async () => {
			if (!oktaAuth.isLoginRedirect()) {
				let isAuthenticated = (await oktaAuth.isAuthenticated()) || false;

				console.group('initAuthState()');
				console.log('isAuthenticated:', isAuthenticated);
				console.groupEnd();

				if (!isAuthenticated) {
					const { isAuthenticated: _isAuthenticated } = await silentAuth(null, {
						isAuthenticated,
						update: false,
					});

					isAuthenticated = _isAuthenticated;
				}

				return isAuthenticated;
			}
		};

		const initApp = async (_oktaAuth, _queryClient) => {
			const isAuthenticated = await initAuthState(_oktaAuth);

			oktaAuth.start();

			dispatch({ type: 'APP_INITIALIZED', payload: { isAuthenticated } });
		};

		const handler = authState => {
			queryClient.invalidateQueries('user');

			dispatch({ type: 'AUTH_STATE_UPDATED', payload: { authState } });
		};

		console.log('AuthContext > authStateManager.subscribe()');

		oktaAuth.authStateManager.subscribe(handler);

		console.log('AuthContext > initAuthState()');

		initApp(oktaAuth, queryClient).catch(error =>
			console.error(`Unable to initialize app! [${error}]`)
		);

		return () => oktaAuth.authStateManager.unsubscribe();
	}, []);

	React.useEffect(() => {
		const { isAuthenticated, isPendingLogin } = state || {};

		if (isAuthenticated && (!oktaAuth.isLoginRedirect() || !isPendingLogin)) {
			console.log('AuthContext > getUserInfo()');

			queryClient.prefetchQuery(['user', 'info'], () => userInfoQueryFn({ dispatch, oktaAuth }));
		}
	}, [state?.isAuthenticated, state?.isPendingLogin]);

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
