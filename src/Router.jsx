/* eslint-disable react-hooks/exhaustive-deps */
import { Auth, Okta, React } from './common';
import { Routes, Route, useLocation } from 'react-router-dom';

import AppLoginCallback from './pages/LoginCallback';
import TrailheadHeader from './components/TrailheadHeader';
import SecureApp from './components/SecureApp';
import HomePage from './pages/Home';
import TodayPage from './pages/Today';

const Router = () => {
	const { oktaAuth } = Okta.useOktaAuth();
	const dispatch = Auth.useAuthDispatch();
	const location = useLocation();

	React.useEffect(() => {
		oktaAuth.authStateManager.subscribe(() => dispatch({ type: 'AUTH_STATE_UPDATED' }));

		return () => oktaAuth.authStateManager.unsubscribe();
	}, []);

	const showHeader = location.pathname !== '/login/callback';

	return (
		<>
			{showHeader && <TrailheadHeader />}
			<Routes>
				<Route path='/login/callback' element={<AppLoginCallback />} />
				<Route path='/home' element={<HomePage />} />
				<Route element={<SecureApp />}>
					<Route path='/' element={<TodayPage />} />
				</Route>
			</Routes>
		</>
	);
};

export default Router;
