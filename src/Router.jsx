/* eslint-disable react-hooks/exhaustive-deps */
import { Auth, Okta, React } from './common';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';

import AppLoginCallback from './pages/LoginCallback';
import TrailheadHeader from './components/TrailheadHeader';
import SecureApp from './components/SecureApp';
import LandingPage from './pages/Landing';
import TodayPage from './pages/Today';

const Router = () => {
	const { authState, oktaAuth } = Okta.useOktaAuth();
	const navigate = useNavigate();
	const dispatch = Auth.useAuthDispatch();
	const { getUserInfo, getUser, silentAuth } = Auth.useAuthActions();
	const {
		isAuthenticated,
		isLoggedOut,
		isStaleUserInfo,
		isStaleUserProfile,
		isPendingUserInfoFetch,
		isPendingUserProfileFetch,
		userInfo,
		isPendingLogin,
		profile,
	} = Auth.useAuthState();
	const location = useLocation();
	React.useEffect(() => {
		const _authState = authState || oktaAuth.authStateManager.getAuthState();

		const _isAuthenticated = _authState?.isAuthenticated || isAuthenticated;

		if (!oktaAuth.isLoginRedirect && !isLoggedOut && !isPendingLogin && !_isAuthenticated) {
			console.group('Router > silentAuth()');
			console.log('_isAuthenticated:', _isAuthenticated);
			console.groupEnd();

			silentAuth(dispatch);
		}
	}, [authState, isAuthenticated]);
	React.useEffect(() => {
		const _isAuthenticated = authState?.isAuthenticated || isAuthenticated;

		if (
			_isAuthenticated &&
			(isStaleUserInfo || !userInfo) &&
			!isPendingLogin &&
			!isPendingUserInfoFetch
		) {
			console.debug('Router > getUserInfo()');

			getUserInfo(dispatch);
		}
	}, [authState, isStaleUserInfo, isPendingLogin]);

	React.useEffect(() => {
		const _isAuthenticated = authState?.isAuthenticated || isAuthenticated;

		if (
			_isAuthenticated &&
			userInfo?.sub &&
			(isStaleUserProfile || !profile) &&
			!isPendingLogin &&
			!isPendingUserInfoFetch &&
			!isPendingUserProfileFetch
		) {
			console.debug('Router > getUser()');

			getUser(dispatch, { userId: userInfo.sub });
		}
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
