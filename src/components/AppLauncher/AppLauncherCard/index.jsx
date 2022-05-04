import {
	AppExchangeIcon,
	EventsIcon,
	HelpPortalIcon,
	IdeaExchangeIcon,
	TrailblazerCommunityIcon,
	TrailheadIcon,
} from '../../../common';

const TRAILHEAD_URL = process.env.REACT_APP_TRAILHEAD_URL;
const HELP_URL = process.env.REACT_APP_HELP_URL;

const AppLauncherCard = () => (
	<div className='slds-grid slds-wrap'>
		<a
			href={TRAILHEAD_URL}

			className='slds-col slds-size_1-of-3 slds-text-align_center slds-p-vertical_medium slds-show_inline-block tds-app-launcher__item'
		>
			<figure>
				<TrailheadIcon className='slds-m-bottom_small tds-app-launcher_image' />
			</figure>
			<figcaption className='tds-text-size_3'>Trailhead</figcaption>
		</a>
		<a
			href='#'
			className='slds-col slds-size_1-of-3 slds-text-align_center slds-p-vertical_medium slds-show_inline-block tds-app-launcher__item'
		>
			<figure>
				<TrailblazerCommunityIcon className='slds-m-bottom_small tds-app-launcher_image' />
			</figure>
			<figcaption className='tds-text-size_3'>Trailblazer Community</figcaption>
		</a>
		<a
			href='#'
			className='slds-col slds-size_1-of-3 slds-text-align_center slds-p-vertical_medium slds-show_inline-block tds-app-launcher__item'
		>
			<figure>
				<AppExchangeIcon className='slds-m-bottom_small tds-app-launcher_image' />
			</figure>
			<figcaption className='tds-text-size_3'>AppExchange</figcaption>
		</a>
		<a
			href='#'
			className='slds-col slds-size_1-of-3 slds-text-align_center slds-p-vertical_medium slds-show_inline-block tds-app-launcher__item'
		>
			<figure>
				<IdeaExchangeIcon className='slds-m-bottom_small tds-app-launcher_image' />
			</figure>
			<figcaption className='tds-text-size_3'>IdeaExchange</figcaption>
		</a>
		<a
			href='#'
			className='slds-col slds-size_1-of-3 slds-text-align_center slds-p-vertical_medium slds-show_inline-block tds-app-launcher__item'
		>
			<figure>
				<EventsIcon className='slds-m-bottom_small tds-app-launcher_image' />
			</figure>
			<figcaption className='tds-text-size_3'>Events</figcaption>
		</a>
		<a
			href={HELP_URL}
			className='slds-col slds-size_1-of-3 slds-text-align_center slds-p-vertical_medium slds-show_inline-block tds-app-launcher__item'
		>
			<figure>
				<HelpPortalIcon className='slds-m-bottom_small tds-app-launcher_image' />
			</figure>
			<figcaption className='tds-text-size_3'>Salesforce Help</figcaption>
		</a>
	</div>
);

export default AppLauncherCard;
