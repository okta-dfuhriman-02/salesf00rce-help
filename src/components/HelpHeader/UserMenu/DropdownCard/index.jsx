import { LDS, Mutations, Queries, Utils } from '../../../../common';

import './styles.css';

const PROFILE_APP_URL = process.env.REACT_APP_PROFILE_URL;

const DropdownCard = () => {
	const logout = Mutations.useLogoutMutation();

	const { data: userInfo } = Queries.useUserInfoQuery();
	const { data: user } = Queries.useUserProfileQuery({ userInfo });
	const { profile } = user || {};

	return (
		<div className='dropdown-menu' id='dropdown'>
			<div className='menu__banner' />
			<div
				className='menu__banner-photo'
				style={{
					backgroundImage: `url(${Utils.getProfilePicture(userInfo, profile)})`,
				}}
			/>
			<div className='menu__header'>{Utils.getUserName(userInfo, profile)}</div>
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
					onClick={() => logout.mutate({ userId: profile?.id ?? userInfo?.sub })}
				/>
			</div>
		</div>
	);
};

export default DropdownCard;
