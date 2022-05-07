import { Auth, LDS, isUrl } from '../../common';

import './styles.css';

const PROFILE_APP_URL = process.env.REACT_APP_PROFILE_URL;

const DropdownCard = () => {
	const dispatch = Auth.useAuthDispatch();
	const { logout } = Auth.useAuthActions();
	const {
		profile: { nickName, firstName, displayName, picture },
	} = Auth.useAuthState();

	return (
		<div className='dropdown-menu' id='dropdown'>
			<div className='menu__banner' />
			<div
				className='menu__banner-photo'
				style={
					isUrl(picture)
						? {
								backgroundImage: `url(${picture})`,
						  }
						: {}
				}
			/>
			<div className='menu__header'>{nickName ?? firstName ?? displayName ?? ''}</div>
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
