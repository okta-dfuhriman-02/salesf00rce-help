import { Auth } from './common';
import { Routes, Route } from 'react-router-dom';

import AppLoginCallback from './pages/LoginCallback';
import HelpHeader from './components/HelpHeader';
import PageSpinner from './components/PageSpinner';
import SecureApp from './components/SecureApp';
import HelpPage from './pages/Help';

const Router = () => {
	const { isLoading } = Auth.useAuthState();

	return (
		<>
			<Routes>
				<Route path='/login/callback' element={<AppLoginCallback />} />
				<Route element={<SecureApp header={<HelpHeader />} />}>
					<Route path='/' element={!isLoading ? <HelpPage /> : <PageSpinner />} />
				</Route>
			</Routes>
		</>
	);
};

export default Router;
