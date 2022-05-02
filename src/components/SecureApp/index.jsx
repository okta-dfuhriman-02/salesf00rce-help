/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { Outlet } from 'react-router-dom';

import { Auth, LDS, Okta } from '../../common';

import './styles.css';

const SecureApp = ({ onAuthRequired, children }) => {
	const { authState, oktaAuth, onAuthRequired: _onAuthRequired } = Okta.useOktaAuth();

	const { signInWithRedirect, getUserInfo, getUser, silentAuth } = Auth.useAuthActions();
	const dispatch = Auth.useAuthDispatch();
	const {
		isAuthenticated,
		isPendingLogin,
		isPendingUserInfoFetch,
		isStaleUserInfo,
		isStaleUserProfile,
		userInfo,
	} = Auth.useAuthState();
	const pendingLogin = React.useRef(false);
	React.useEffect(() => {
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

				const onAuthRequiredFn = onAuthRequired || _onAuthRequired;
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
	}, [isPendingLogin, isAuthenticated, onAuthRequired, _onAuthRequired]);

	React.useEffect(() => {
		if ((isStaleUserInfo || !userInfo) && isAuthenticated && !isPendingLogin) {
			console.debug('SecureApp > getUserInfo()');
			return getUserInfo(dispatch);
		}
	}, [isStaleUserInfo, isAuthenticated, userInfo]);

	React.useEffect(() => {
		if (
			isStaleUserProfile &&
			isAuthenticated &&
			!isPendingLogin &&
			!isPendingUserInfoFetch &&
			userInfo?.sub
		) {
			console.debug('SecureApp > getUser()');
			return getUser(dispatch, { userId: userInfo.sub });
		}
	}, [isStaleUserProfile]);

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
