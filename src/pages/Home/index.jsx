import { React, TrailheadConnect, TrailheadEarn, TrailheadLearn } from '../../common';
import lottie from 'lottie-web';

const HomePage = () => {
	React.useEffect(() => {
		const setupAnimations = async () => {
			const animationConfigs = [
				{
					container: document.querySelector('.th-new-hero__astro-animation'),
					path: '/animations/astro-animation.json',
				},
				{
					container: document.querySelector('.th-new-hero__codey-animation'),
					path: '/animations/codey-animation.json',
				},
			];
			let animations = animationConfigs.map(config =>
				lottie.loadAnimation({ ...config, renderer: 'svg', loop: true, autoplay: false })
			);

			if (typeof IntersectionObserver !== 'undefined') {
				const observer = new IntersectionObserver(entries => {
					entries.forEach(entry => {
						let index = animationConfigs.map(c => c.container).indexOf(entry.target);
						let animation = animations[index];

						if (entry.isIntersecting) {
							animation.play();
						} else {
							animation.pause();
						}
					});
				});
				animationConfigs.forEach(config => observer.observe(config.container));
			} else {
				animations.forEach(animation => animation.play());
			}
		};

		document.addEventListener('DOMContentLoaded', setupAnimations);

		return () => document.removeEventListener('DOMContentLoaded', setupAnimations);
	}, []);

	return (
		<>
			<div className='th-new-hero_outer'></div>
			<div className='th-new-hero th-new-hero--landscape'>
				<div className='th-new-hero__astro-animation'></div>
				<div className='th-new-hero__codey-animation'></div>
				<div className='slds-text-align_center slds-container_center' style={{ maxWidth: '45rem' }}>
					<div className='slds-show_medium'>
						<h1
							className='tds-text-heading_neutraface-xx-large tds-color_midnight'
							style={{ marginTop: '85px' }}
						>
							Skill up for the future
						</h1>
						<div className='slds-text-heading_large slds-m-bottom_x-large'>
							Learn new skills from anywhere
						</div>
						<div className='slds-m-top_x-large'>
							<div>
								<div className='slds-m-top_medium'>
									<button
										className='slds-button slds-button--important tds-button_x-large tds-button_important'
										style={{ fontWeight: 'bold' }}
										tabIndex='0'
									>
										Get Started for Free
									</button>
								</div>
							</div>
						</div>
					</div>
					<div className='slds-hide_medium'>
						<h1 className='tds-text-heading_neutraface-x-large tds-color_midnight slds-p-horizontal_large slds-m-top_xx-large'>
							Skill up for the future
						</h1>
						<div className='slds-text-heading_medium slds-p-horizontal_large slds-m-bottom_x-large'>
							Learn new skills from anywhere
							<div>
								<div className='slds-m-top_medium'>
									<button
										className='slds-button slds-button--important tds-button_x-large tds-button_important'
										style={{ fontWeight: 'bold' }}
										tabIndex='0'
									>
										Get Started for Free
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className='slds-container_x-large slds-container_center th-lec-section'>
				<div className='slds-text-align_center'>
					<h2 className='slds-show_medium tds-text-heading_neutraface-x-large slds-m-bottom_large slds-p-horizontal_medium tds-color_midnight'>
						Trailhead Is the Fun Way to Learn
					</h2>
					<h2 className='slds-hide_medium tds-text-heading_neutraface-large slds-m-bottom_large slds-p-horizontal_large tds-color_midnight'>
						Trailhead Is the Fun Way to Learn
					</h2>
				</div>
				<div className='slds-grid slds-wrap slds-text-align_center'>
					<div className='slds-col slds-size_1-of-1 slds-medium-size_4-of-12 slds-large-size_4-of-12'>
						<TrailheadLearn style={{ height: '65px' }} />
						<div className='slds-m-top_medium slds-m-bottom_x-small slds-text-heading_medium'>
							Learn In-Demand Skills
						</div>
						<p className='slds-p-horizontal_xx-large slds-m-bottom_x-large'>
							Get hands-on and learn the Salesforce, digital, and soft skills you need to succeed
							from anywhere for free.
						</p>
					</div>
					<div className='slds-col slds-size_1-of-1 slds-medium-size_4-of-12 slds-large-size_4-of-12'>
						<TrailheadEarn style={{ height: '65px' }} />
						<div className='slds-m-top_medium slds-m-bottom_x-small slds-text-heading_medium'>
							Earn Resume-Worthy Credentials
						</div>
						<p className='slds-p-horizontal_xx-large slds-m-bottom_x-large'>
							Prove your skills and earn globally-recognized credentials that demonstrate your
							expertise to current and future employers.
						</p>
					</div>
					<div className='slds-col slds-size_1-of-1 slds-medium-size_4-of-12 slds-large-size_4-of-12'>
						<TrailheadConnect style={{ height: '65px' }} />
						<div className='slds-m-top_medium slds-m-bottom_x-small slds-text-heading_medium'>
							Connect to Opportunities
						</div>
						<p className='slds-p-horizontal_xx-large slds-m-bottom_x-large'>
							Join the global Trailblazer Community to learn relevant skills, connect to
							Trailblazers, and give back.
						</p>
					</div>
				</div>
			</div>
		</>
	);
};

export default HomePage;
