/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { Outlet } from 'react-router-dom';

import { Auth, LDS, Okta } from '../../common';

import './styles.css';

const SecureApp = ({ onAuthRequired, children }) => {
	const { authState, oktaAuth } = Okta.useOktaAuth();

	const { signInWithRedirect, silentAuth } = Auth.useAuthActions();
	const dispatch = Auth.useAuthDispatch();
	const { isAuthenticated, isPendingLogin } = Auth.useAuthState();
	const pendingLogin = React.useRef(false);
	React.useEffect(() => {
		const _isAuthenticated = authState?.isAuthenticated || isAuthenticated;

		const handleLogin = async () => {
			if (pendingLogin.current) {
				return;
			}

			pendingLogin.current = true;

			// try silentAuth before redirecting to login
			console.debug('SecureApp > trying silentAuth()');
			const { isAuthenticated: silentIsAuthenticated = false } = (await silentAuth(dispatch)) || {};
			console.debug('SecureApp > isSilentAuthenticated:', silentIsAuthenticated);
			if (!silentIsAuthenticated) {
				const originalUri = Okta.toRelativeUrl(window.location.href, window.location.origin);

				oktaAuth.setOriginalUri(originalUri);

				const onAuthRequiredFn = onAuthRequired;
				console.debug('authRequired');
				if (onAuthRequiredFn) {
					await onAuthRequiredFn(oktaAuth);
				} else {
					console.debug('SecureApp > signInWithRedirect()');
					await signInWithRedirect(dispatch);
				}
			}
		};

		if (_isAuthenticated) {
			pendingLogin.current = false;
			return;
		}

		if (!_isAuthenticated && !isPendingLogin) {
			console.debug('SecureApp > handleLogin()');
			handleLogin();
		}
	}, [isPendingLogin, authState?.isAuthenticated, isAuthenticated, onAuthRequired]);

	if (!authState?.isAuthenticated || !isAuthenticated) {
		return <LDS.Spinner variant='inverse' size='large' containerClassName='sign-in-loader' />;
	}

	if (children) {
		return children;
	}
	console.debug('SecureApp > return <Outlet/>');
	return <Outlet />;
};

export default SecureApp;
