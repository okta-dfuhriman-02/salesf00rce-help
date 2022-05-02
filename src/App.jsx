import { Auth, Okta, LDS, React, useEffect } from './common';
import { useLocation, useNavigate } from 'react-router-dom';

import useBodyClass from './hooks/useBodyClass';

import Router from './Router';

const oktaAuth = new Okta.Auth(Okta.config.oidc);

oktaAuth.start();

const App = () => {
	useBodyClass('tds-bg_sand');

	const { pathname } = useLocation();
	const navigate = useNavigate();
	const restoreOriginalUri = async (_oktaAuth, originalUri) => {
		const originalURL = new URL(originalUri);

		if (originalURL?.pathname === '/') {
			navigate('/today', { replace: true });
		} else {
			navigate(Okta.toRelativeUrl(originalUri || '/', window.location.origin), { replace: true });
		}
	};
	const customAuthHandler = () => {
		navigate('/', { replace: true });
	};

	// Setting page scroll to 0 when changing the route
	useEffect(() => {
		document.documentElement.scrollTop = 0;

		if (document?.scrollingElement) {
			document.scrollingElement.scrollTop = 0;
		}
	}, [pathname]);

	return (
		<React.Suspense fallback={<LDS.Spinner variant='brand' />}>
			<Okta.Security
				oktaAuth={oktaAuth}
				restoreOriginalUri={restoreOriginalUri}
				onAuthRequired={customAuthHandler}
			>
				<Auth.Provider>
					<LDS.IconSettings iconPath='/assets/icons'>
						<Router />
					</LDS.IconSettings>
				</Auth.Provider>
			</Okta.Security>
		</React.Suspense>
	);
};

export default App;
