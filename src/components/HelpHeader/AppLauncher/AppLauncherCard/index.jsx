/* eslint-disable jsx-a11y/anchor-is-valid */
import { Icons } from '../../../../common';

const TRAILHEAD_URL = process.env.REACT_APP_TRAILHEAD_URL;
const HELP_URL = process.env.REACT_APP_HELP_URL;

// TODO: change <a> into <button> so that we can disable the current app
const AppLauncherCard = () => (
	<div className='slds-grid slds-wrap'>
		<a
			href={TRAILHEAD_URL}
			className='slds-col slds-size_1-of-3 slds-text-align_center slds-p-vertical_medium slds-show_inline-block tds-app-launcher__item'
		>
			<figure>
				<Icons.Trailhead className='slds-m-bottom_small tds-app-launcher_image' />
			</figure>
			<figcaption className='tds-text-size_3'>Trailhead</figcaption>
		</a>
		<a
			href='#'
			className='slds-col slds-size_1-of-3 slds-text-align_center slds-p-vertical_medium slds-show_inline-block tds-app-launcher__item'
		>
			<figure>
				<Icons.TrailblazerCommunity className='slds-m-bottom_small tds-app-launcher_image' />
			</figure>
			<figcaption className='tds-text-size_3'>Trailblazer Community</figcaption>
		</a>
		<a
			href='#'
			className='slds-col slds-size_1-of-3 slds-text-align_center slds-p-vertical_medium slds-show_inline-block tds-app-launcher__item'
		>
			<figure>
				<Icons.AppExchange className='slds-m-bottom_small tds-app-launcher_image' />
			</figure>
			<figcaption className='tds-text-size_3'>AppExchange</figcaption>
		</a>
		<a
			href='#'
			className='slds-col slds-size_1-of-3 slds-text-align_center slds-p-vertical_medium slds-show_inline-block tds-app-launcher__item'
		>
			<figure>
				<Icons.IdeaExchange className='slds-m-bottom_small tds-app-launcher_image' />
			</figure>
			<figcaption className='tds-text-size_3'>IdeaExchange</figcaption>
		</a>
		<a
			href='#'
			className='slds-col slds-size_1-of-3 slds-text-align_center slds-p-vertical_medium slds-show_inline-block tds-app-launcher__item'
		>
			<figure>
				<Icons.Events className='slds-m-bottom_small tds-app-launcher_image' />
			</figure>
			<figcaption className='tds-text-size_3'>Events</figcaption>
		</a>
		<a
			href={HELP_URL}
			className='slds-col slds-size_1-of-3 slds-text-align_center slds-p-vertical_medium slds-show_inline-block tds-app-launcher__item'
		>
			<figure>
				<Icons.HelpPortal className='slds-m-bottom_small tds-app-launcher_image' />
			</figure>
			<figcaption className='tds-text-size_3'>Salesforce Help</figcaption>
		</a>
	</div>
);

export default AppLauncherCard;
