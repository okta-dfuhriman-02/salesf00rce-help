import { LDS, React } from './common';
import AuthProvider from './providers/AuthProvider/AuthContext';
import { useLocation } from 'react-router-dom';

import useBodyClass from './hooks/useBodyClass';

import Router from './Router';

const App = () => {
	useBodyClass('tds-bg_sand');

	const { pathname } = useLocation();

	// Setting page scroll to 0 when changing the route
	React.useEffect(() => {
		document.documentElement.scrollTop = 0;

		if (document?.scrollingElement) {
			document.scrollingElement.scrollTop = 0;
		}
	}, [pathname]);

	return (
		<React.Suspense fallback={<LDS.Spinner variant='brand' />}>
			<AuthProvider>
				<LDS.IconSettings iconPath='/assets/icons'>
					<Router />
				</LDS.IconSettings>
			</AuthProvider>
		</React.Suspense>
	);
};

export default App;
