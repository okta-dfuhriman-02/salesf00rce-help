import { Auth, LDS, Link, React, SalesforceLogo } from '../../common';

import AppLauncher from '../AppLauncher';
import HeaderNav from './HeaderNav';
import UserMenu from '../UserMenu';

import './styles.css';

const TrailheadHeader = () => {
	const { isAuthenticated, isPendingLogout, isPendingLogin } = Auth.useAuthState();
	const dispatch = Auth.useAuthDispatch();
	const { login } = Auth.useAuthActions();

	const handleLogin = () => login(dispatch);
	const handleSignUp = () => login(dispatch, { isSignUp: true });

	return (
		<div
			id='nav-bar'
			className='tds-desktop-header tds-bg_white slds-show__medium slds-show_medium'
			style={{
				borderBottom: '3px solid rgb(0, 112, 210)',
				position: 'sticky',
				top: 0,
				zIndex: 5000,
			}}
		>
			<div
				id='nav-container'
				className='slds-grid slds-container_x-large slds-container_center slds-p-horizontal_small'
			>
				<div
					id='logo'
					className='slds-p-vertical_small slds-p-horizontal_medium slds-grid slds-grid_align-spread slds-grow slds-grid_vertical-align-center'
				>
					<Link to='/'>
						<SalesforceLogo style={{ height: '86px' }} />
					</Link>
				</div>
				<HeaderNav />
				<div
					id='nav-actions'
					className='slds-grid slds-grid_vertical-align-top slds-p-around-small'
				>
					<div className='slds-grid slds-grid_vertical-align-center slds-p-around_x-small'>
						{(isAuthenticated || isPendingLogout) && (
							<>
								<div className='slds-p-right_large slds-m-right_large'>
									<AppLauncher />
								</div>
								<UserMenu />
							</>
						)}
						{!isPendingLogout && !isAuthenticated && (
							<>
								<LDS.Button
									label='Sign Up'
									style={
										isPendingLogin
											? {
													borderColor: 'rgba(255, 255, 255, 0.75)',
													boxShadow: '0 1px 0 rgba(255, 255, 255, 0.75)',
											  }
											: {}
									}
									variant='brand'
									onClick={handleSignUp}
								>
									{isPendingLogin && (
										<LDS.Spinner containerStyle={{ borderRadius: '4px' }} size='x-small' />
									)}
								</LDS.Button>
								<LDS.Button label='Login' onClick={handleLogin}>
									{isPendingLogin && (
										<LDS.Spinner
											containerStyle={{ borderRadius: '4px' }}
											variant='brand'
											size='x-small'
										/>
									)}
								</LDS.Button>
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default TrailheadHeader;
