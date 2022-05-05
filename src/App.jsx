import { LDS, React } from './common';
import AuthProvider from './providers/AuthProvider/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';

import useBodyClass from './hooks/useBodyClass';

import Router from './Router';

// const oktaAuth = new Okta.Auth(Okta.config.oidc);

// oktaAuth.start();

const App = () => {
	useBodyClass('tds-bg_sand');

	const { pathname } = useLocation();
	// const navigate = useNavigate();
	// const restoreOriginalUri = async (_oktaAuth, originalUri) =>
	// 	navigate(Okta.toRelativeUrl(originalUri || '/', window.location.origin), { replace: true });

	// const customAuthHandler = () => {
	// 	navigate('/', { replace: true });
	// };

	// Setting page scroll to 0 when changing the route
	React.useEffect(() => {
		document.documentElement.scrollTop = 0;

		if (document?.scrollingElement) {
			document.scrollingElement.scrollTop = 0;
		}
	}, [pathname]);

	return (
		<React.Suspense fallback={<LDS.Spinner variant='brand' />}>
			{/* <Okta.Security
				oktaAuth={oktaAuth}
				restoreOriginalUri={restoreOriginalUri}
				onAuthRequired={customAuthHandler}
			> */}
			<AuthProvider>
				<LDS.IconSettings iconPath='/assets/icons'>
					<Router />
				</LDS.IconSettings>
			</AuthProvider>
			{/* </Okta.Security> */}
		</React.Suspense>
	);
};

export default App;
