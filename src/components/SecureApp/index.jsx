/* eslint-disable react-hooks/exhaustive-deps */

import { Auth, LDS, PropTypes, Okta, React, ReactQuery, ReactRouter } from '../../common';

import './styles.css';

const SecureApp = ({ header, onAuthRequired, children }) => {
	const { oktaAuth } = Okta.useOktaAuth();

	const isPendingLogin = ReactQuery.useIsMutating('login') > 0;

	const { isAuthenticated, _initialized } = Auth.useAuthState();
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
					await Auth.signInWithRedirect({ oktaAuth });
				}
			}
		};

		if (isAuthenticated) {
			pendingLogin.current = false;
			return;
		}

		if (_initialized && !isAuthenticated && !isPendingLogin) {
			console.debug('SecureApp > handleLogin()');
			handleLogin();
		}
	}, [_initialized, isPendingLogin, isAuthenticated, onAuthRequired]);

	if (!isAuthenticated) {
		return <LDS.Spinner variant='inverse' size='large' containerClassName='sign-in-loader' />;
	}

	if (children) {
		return children;
	}

	console.debug('SecureApp > return <Outlet/>');
	return (
		<>
			{header}
			<ReactRouter.Outlet />
		</>
	);
};

SecureApp.propTypes = {
	header: PropTypes.element,
	onAuthRequired: PropTypes.func,
	children: PropTypes.node,
};

export default SecureApp;
