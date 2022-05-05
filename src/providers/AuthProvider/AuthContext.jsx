/* eslint-disable react-hooks/exhaustive-deps */
/** @format */

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
	const restoreOriginalUri = async (_oktaAuth, originalUri) =>
		navigate(toRelativeUrl(originalUri || '/', window.location.origin), { replace: true });

	const customAuthHandler = () => {
		navigate('/', { replace: true });
	};
	const [state, dispatch] = React.useReducer(AuthReducer, initialState, initializeState);

	React.useLayoutEffect(() => {
		const handler = authState => dispatch({ type: 'AUTH_STATE_UPDATED', payload: { authState } });

		console.debug('AuthContext > authStateManager.subscribe()');

		oktaAuth.authStateManager.subscribe(handler);

		oktaAuth.start();

		return () => oktaAuth.authStateManager.unsubscribe();
	}, []);

	// eslint-disable-next-line react/jsx-no-constructed-context-values
	const contextValues = {
		...state,
	};

	return (
		<Security
			oktaAuth={oktaAuth}
			restoreOriginalUri={restoreOriginalUri}
			onAuthRequired={customAuthHandler}
		>
			<AuthStateContext.Provider value={contextValues}>
				<AuthDispatchContext.Provider value={dispatch}>{children}</AuthDispatchContext.Provider>
			</AuthStateContext.Provider>
		</Security>
	);
};

AuthProvider.propTypes = {
	children: PropTypes.node,
};

export default AuthProvider;
