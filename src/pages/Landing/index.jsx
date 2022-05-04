import { Auth } from '../../common';

import Home from '../../components/Home';
import Today from '../../components/Today';

const LandingPage = () => {
	const { isAuthenticated } = Auth.useAuthState();

	return (
		<>
			{isAuthenticated && <Today />}
			{!isAuthenticated && <Home />}
		</>
	);
};

export default LandingPage;
