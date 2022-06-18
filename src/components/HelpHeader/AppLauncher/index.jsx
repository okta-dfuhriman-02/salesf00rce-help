import { LDS, React } from '../../../common';

import AppLauncherCard from './AppLauncherCard';

const AppLauncher = () => (
	<LDS.Popover
		align='bottom right'
		className='slds-m-top_xx-small slds-p-vertical_small slds-p-horizontal_x-small slds-is-absolute tds-app-launcher'
		triggerClassName='header-dropdown__trigger'
		body={<AppLauncherCard />}
		style={{ top: '3rem', right: 0 }}
		role='dialog'
		id='app-launcher'
		hasNoNubbin
		hasNoCloseButton
	>
		<LDS.Button variant='icon' iconCategory='utility' iconName='apps' iconSize='large'></LDS.Button>
	</LDS.Popover>
);

export default AppLauncher;
