import { Auth, LDS, getUserName, useUserInfoQuery, useUserProfileQuery } from '../../common';

const Help = () => {
	const dispatch = Auth.useAuthDispatch();

	const { data: userInfo } = useUserInfoQuery(dispatch);
	const { data: profile } = useUserProfileQuery({ dispatch, userInfo });

	return (
		<div className='root'>
			<div className='slds-grid slds-wrap'>
				<div className='slds-col slds-size_12-of-12 hero-space'>
					<div
						style={{ paddingTop: '64px' }}
						className='hero-container slds-grid slds-grid_vertical slds-align_absolute-center'
					>
						<div tabIndex='0' className='hero-user-name slds-col'>
							Hello, {getUserName(userInfo, profile)}
						</div>
						<div tabIndex='0' className='hero-search-title slds-col'>
							How can we help?
						</div>
						<LDS.Search placeholder='Search' className='hero-search-input-container slds-col' />
					</div>
				</div>
			</div>
		</div>
	);
};

export default Help;
