import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';

import AppLoginCallback from './pages/LoginCallback';
import TrailheadHeader from './components/TrailheadHeader';
import SecureApp from './components/SecureApp';
import LandingPage from './pages/Landing';
import TodayPage from './pages/Today';

const Router = () => {
	const navigate = useNavigate();

	const location = useLocation();

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
