import { LDS, React, ReactQuery, ReactRouter, useBodyClass } from './common';
import { ReactQueryDevtools } from 'react-query/devtools';
import { persistQueryClient } from 'react-query/persistQueryClient-experimental';
import { createWebStoragePersistor } from 'react-query/createWebStoragePersistor-experimental';

import AuthProvider from './providers/AuthProvider/AuthContext';
import Router from './Router';

const STALE_TIME = process.env.QUERY_STALE_TIME || 2.5; // Time in **MINUTES** to be used when setting the staleTime configuration.

const onError = error => console.error(error);

const queryClient = new ReactQuery.QueryClient({
	defaultOptions: {
		mutations: { onError },
		queries: { onError, staleTime: 1000 * 60 * STALE_TIME },
	},
});

const localStoragePersistor = createWebStoragePersistor({ storage: window.localStorage });

persistQueryClient({
	queryClient,
	persistor: localStoragePersistor,
	maxAge: 1000 * 60 * 5,
	dehydrateOptions: { dehydrateMutations: true, dehydrateQueries: true },
});

const App = () => {
	useBodyClass('tds-bg_sand');

	const { pathname } = ReactRouter.useLocation();

	// Setting page scroll to 0 when changing the route
	React.useEffect(() => {
		document.documentElement.scrollTop = 0;

		if (document?.scrollingElement) {
			document.scrollingElement.scrollTop = 0;
		}
	}, [pathname]);

	return (
		<React.Suspense fallback={<LDS.Spinner variant='brand' />}>
			<ReactQuery.QueryClientProvider client={queryClient}>
				<AuthProvider>
					<LDS.IconSettings iconPath='/assets/icons'>
						<Router />
					</LDS.IconSettings>
				</AuthProvider>
				<ReactQueryDevtools initialIsOpen={true} />
			</ReactQuery.QueryClientProvider>
		</React.Suspense>
	);
};

export default App;
