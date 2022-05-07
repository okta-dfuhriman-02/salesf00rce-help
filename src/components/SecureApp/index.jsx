/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { Outlet } from 'react-router-dom';

import { Auth, LDS, Okta } from '../../common';

import './styles.css';

const SecureApp = ({ onAuthRequired, children }) => {
	const { oktaAuth } = Okta.useOktaAuth();

	const { signInWithRedirect } = Auth.useAuthActions();
	const dispatch = Auth.useAuthDispatch();
	const { isAuthenticated, isPendingLogin } = Auth.useAuthState();
	const pendingLogin = React.useRef(false);
	React.useEffect(() => {
		const handleLogin = async () => {
			if (pendingLogin.current) {
				return;
			}

			pendingLogin.current = true;

			if (!isAuthenticated) {
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

		if (isAuthenticated) {
			pendingLogin.current = false;
			return;
		}

		if (!isAuthenticated && !isPendingLogin) {
			console.debug('SecureApp > handleLogin()');
			handleLogin();
		}
	}, [isPendingLogin, isAuthenticated, onAuthRequired]);

	if (!isAuthenticated) {
		return <LDS.Spinner variant='inverse' size='large' containerClassName='sign-in-loader' />;
	}

	if (children) {
		return children;
	}
	console.debug('SecureApp > return <Outlet/>');
	return <Outlet />;
};

export default SecureApp;
