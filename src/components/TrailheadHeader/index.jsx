import { Auth, LDS, Link, React, TrailheadLogo } from '../../common';

import AppLauncher from '../AppLauncher';
import DropdownCard from '../DropdownCard';
import HeaderNav from './HeaderNav';

import './styles.css';

const TrailheadHeader = () => {
	const { isAuthenticated, isPendingLogout, isPendingLogin, isPendingUserInfoFetch, userInfo } =
		Auth.useAuthState();
	const dispatch = Auth.useAuthDispatch();
	const { login } = Auth.useAuthActions();

	const handleLogin = () => login(dispatch);
	const handleSignUp = () => login(dispatch, { isSignUp: true });

	const Spinner = () => (
		<div
			className='slds-m-right_small'
			style={{ position: 'relative', width: '8rem', height: '3rem' }}
		>
			<LDS.Spinner
				variant='brand'
				size='small'
				containerClassName='slds-align_absolute-center slds-p-around_large '
				containerStyle={{ left: 'unset', right: 'unset' }}
			/>
		</div>
	);

	const UserPanel = () =>
		isPendingLogout || isPendingUserInfoFetch || !userInfo ? (
			<Spinner />
		) : (
			<>
				<div className='slds-m-right_small'>
					<LDS.Dropdown
						className='header-dropdown'
						align='right'
						width='small'
						menuStyle={{ width: '16rem', border: 'none', boxShadow: 'none' }}
					>
						<DropdownCard />
						<LDS.DropdownTrigger>
							<LDS.Button variant='base' className='tds-avatar'>
								<div
									style={{
										display: 'flex',
										flexDirection: 'row',
										alignContent: 'center',
										alignItems: 'center',
										justifyContent: 'flex-start',
									}}
								>
									<div
										className='tds-text-size_3 tds-text_bold slds-text-align_right slds-m-right_small slds-truncate'
										style={{ color: 'black' }}
									>
										{userInfo?.name}
									</div>
									<LDS.Avatar
										imgSrc={userInfo?.picture ?? 'assets/images/astro.svg'}
										imgAlt={userInfo?.name}
										size='medium'
									/>
								</div>
							</LDS.Button>
						</LDS.DropdownTrigger>
					</LDS.Dropdown>
				</div>
			</>
		);

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
						<TrailheadLogo style={{ height: '86px' }} />
					</Link>
				</div>
				<div id='nav-search'>
					<LDS.Search placeholder='Search' styleContainer={{ width: '100%' }} />
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
								<UserPanel />
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
