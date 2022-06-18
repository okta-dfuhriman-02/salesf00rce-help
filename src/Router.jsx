import { Auth, ReactRouter } from './common';

import { HelpHeader, SecureApp } from './components';
import AppLoginCallback from './pages/AppLoginCallback';
import HelpPage from './pages/Help';
import Loading from './pages/Loading';

const Router = () => {
	const { isLoading } = Auth.useAuthState();

	return (
		<>
			<ReactRouter.Routes>
				<ReactRouter.Route path='/login/callback' element={<AppLoginCallback />} />
				<ReactRouter.Route element={<SecureApp header={<HelpHeader />} />}>
					<ReactRouter.Route path='/' element={!isLoading ? <HelpPage /> : <Loading />} />;
				</ReactRouter.Route>
			</ReactRouter.Routes>
		</>
	);
};

export default Router;
