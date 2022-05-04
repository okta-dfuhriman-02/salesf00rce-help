/* eslint-disable react-hooks/exhaustive-deps */
import { Auth, Okta, React } from './common';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';

import AppLoginCallback from './pages/LoginCallback';
import TrailheadHeader from './components/TrailheadHeader';
import SecureApp from './components/SecureApp';
import LandingPage from './pages/Landing';
import TodayPage from './pages/Today';
import { getUserInfo } from '@okta/okta-auth-js';

const Router = () => {
	const { authState } = Okta.useOktaAuth();
	const navigate = useNavigate();
	const dispatch = Auth.useAuthDispatch();
	const { silentAuth } = Auth.useAuthActions();
	const {
		isAuthenticated,
		isStaleUserInfo,
		isStaleUserProfile,
		isPendingUserInfoFetch,
		userInfo,
		isPendingLogin,
		profile,
	} = Auth.useAuthState();
	const location = useLocation();

	React.useEffect(() => {
		const _isAuthenticated = authState?.isAuthenticated || isAuthenticated;

		if (!isPendingLogin && _isAuthenticated) silentAuth(dispatch);
	}, [authState?.isAuthenticated, isAuthenticated]);
	React.useEffect(() => {
		if (authState?.isAuthenticated && (isStaleUserInfo || !userInfo) && !isPendingLogin) {
			getUserInfo(dispatch);
		}
	}, [authState, isStaleUserInfo, isPendingLogin]);

	React.useEffect(() => {
		if (
			authState?.isAuthenticated &&
			(isStaleUserProfile || !profile) &&
			!isPendingLogin &&
			!isPendingUserInfoFetch
		)
			getUserInfo(dispatch, { userId: userInfo.sub });
	}, [authState?.isAuthenticated, isStaleUserProfile, isPendingLogin, isPendingUserInfoFetch]);

	const showHeader = location.pathname !== '/login/callback';

	return (
		<>
			{showHeader && <TrailheadHeader />}
			<Routes>
				<Route path='/login/callback' element={<AppLoginCallback />} />
				<Route path='/' element={<LandingPage />} />
				<Route element={<SecureApp onAuthRequired={() => navigate('/', { replace: true })} />}>
					<Route path='/today' element={<TodayPage />} />
				</Route>
			</Routes>
		</>
	);
};

export default Router;
