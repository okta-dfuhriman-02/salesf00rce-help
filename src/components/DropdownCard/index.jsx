import { Auth, LDS, aridDunes } from '../../common';

import './styles.css';

const PROFILE_APP_URL = process.env.REACT_APP_PROFILE_URL;

const DropdownCard = () => {
	const dispatch = Auth.useAuthDispatch();
	const { logout } = Auth.useAuthActions();
	const { userInfo } = Auth.useAuthState();

	return (
		<div className='dropdown-menu' id='dropdown'>
			<div className='menu__banner' style={{ backgroundImage: `url(${aridDunes})` }} />
			<div
				className='menu__banner-photo'
				style={{ backgroundImage: `url(${userInfo?.picture ?? 'assets/images/astro.svg'})` }}
			/>
			<div className='menu__header'>{userInfo?.name}</div>
			<ul className='menu__items'>
				<li role='presentation'>
					<a href={PROFILE_APP_URL} className='menu__item' role='menuitem'>
						Profile
					</a>
				</li>
				<li role='presentation'>
					<a href={`${PROFILE_APP_URL}/settings`} className='menu__item' role='menuitem'>
						Settings
					</a>
				</li>
			</ul>
			<div className='menu__footer'>
				<LDS.Button
					className='menu__item'
					variant='base'
					label='Logout'
					onClick={() => logout(dispatch)}
				/>
			</div>
		</div>
	);
};

export default DropdownCard;
