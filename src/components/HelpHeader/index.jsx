import { Auth, Images, LDS, Mutations, React, ReactQuery, ReactRouter } from '../../common';

import AppLauncher from './AppLauncher';
import HeaderNav from './HeaderNav';
import UserMenu from './UserMenu';

import './styles.css';

const HelpHeader = () => {
	const isPendingLogout = ReactQuery.useIsMutating('logout') > 0;
	const isPendingLogin = ReactQuery.useIsMutating('login') > 0;

	const { isAuthenticated } = Auth.useAuthState();

	const login = Mutations.useLoginMutation();

	const handleLogin = () => login.mutate();
	const handleSignUp = () => login.mutate({ isSignUp: true });

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
					<ReactRouter.Link to='/'>
						<Images.SalesforceLogo style={{ height: '86px' }} />
					</ReactRouter.Link>
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

export default HelpHeader;
