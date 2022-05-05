import {
	_,
	Auth,
	LDS,
	AppleIconRound,
	EmailIconRound,
	FacebookIconRound,
	GoogleIconRound,
	LinkedInIconRound,
	SalesforceIconRound,
} from '../../common';

const WelcomeCard = () => {
	const { profile, credentials, isPendingAccountLink, isPendingUserFetch } = Auth.useAuthState();

	const currentAccounts = credentials?.filter(({ isLoggedIn }) => isLoggedIn);

	const currentAccount =
		currentAccounts?.length > 1
			? currentAccounts?.filter(
					({ provider: { type } }) => type !== 'email' && type !== 'password'
			  )[0]
			: currentAccounts[0];

	let providerIcon;

	const {
		login,
		provider: { name: providerName },
	} = currentAccount || {};

	switch (providerName) {
		case 'apple':
			providerIcon = <AppleIconRound className='slds-icon tds-icon-social slds-icon_small' />;
			break;
		case 'facebook':
			providerIcon = <FacebookIconRound className='slds-icon tds-icon-social slds-icon_small' />;
			break;
		case 'google':
			providerIcon = <GoogleIconRound className='slds-icon tds-icon-social slds-icon_small' />;
			break;
		case 'linkedin':
			providerIcon = <LinkedInIconRound className='slds-icon tds-icon-social slds-icon_small' />;
			break;
		case 'salesforce':
			providerIcon = <SalesforceIconRound className='tds-icon-social slds-icon_small' />;
			break;
		default:
			providerIcon = <EmailIconRound className='slds-icon tds-icon-social slds-icon_small' />;
	}

	const cardBody = (
		<>
			{(isPendingAccountLink || isPendingUserFetch) && (
				<div>
					<LDS.Spinner />
				</div>
			)}
			<div>
				Hey{!_.isEmpty(profile) ? ` ${profile?.firstName ?? profile?.nickName}` : ''}! You're logged
				in with your {_.capitalize(providerName)} account:&nbsp;&nbsp;
				<span className='tds-text_bold break-word'>
					{providerIcon} {login}.
				</span>
			</div>
		</>
	);
	const cardHeader = (
		<LDS.MediaObject
			verticalCenter
			body={cardBody}
			figure={
				<LDS.Avatar
					imgSrc={profile?.picture ?? '../../common/assets/images/astro.svg'}
					imgAlt={profile?.displayName}
					size='large'
				/>
			}
		/>
	);

	return (
		<LDS.Card
			id='welcome-card'
			key='welcome-card'
			className='tds-carde'
			bodyClassName='slds-card__body_inner'
			header={cardHeader}
		/>
	);
};

export default WelcomeCard;
