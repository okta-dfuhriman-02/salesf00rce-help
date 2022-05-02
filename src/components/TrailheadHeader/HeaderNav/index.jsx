import { Auth, LDS } from '../../../common';
import './styles.css';

const HeaderNav = () => {
	const { isAuthenticated } = Auth.useAuthState();

	return (
		<div id='header-nav'>
			<nav role='navigation' className='nav'>
				<ul className='nav-list'>
					<li className='nav-list-item nav-list-item__active'>
						<a href='#' className='nav-list-item__link'>
							{isAuthenticated && 'Today'}
							{!isAuthenticated && 'Home'}
						</a>
					</li>
					<li className='nav-list-item nav-list-item'>
						<button className='nav-list-item__button'>
							Learn
							<LDS.Icon
								containerClassName='nav-list-item__arrow'
								category='utility'
								name='chevrondown'
								size='xx-small'
							/>
						</button>
					</li>
					<li className='nav-list-item nav-list-item'>
						<button className='nav-list-item__button'>
							Credentials
							<LDS.Icon
								containerClassName='nav-list-item__arrow'
								category='utility'
								name='chevrondown'
								size='xx-small'
							/>
						</button>
					</li>
					<li className='nav-list-item nav-list-item--active'>
						<button className='nav-list-item__button'>
							Community
							<LDS.Icon
								containerClassName='nav-list-item__arrow'
								category='utility'
								name='chevrondown'
								size='xx-small'
							/>
						</button>
					</li>
					<li className='nav-list-item nav-list-item'>
						<button className='nav-list-item__button'>
							For Companies
							<LDS.Icon
								containerClassName='nav-list-item__arrow'
								category='utility'
								name='chevrondown'
								size='xx-small'
							/>
						</button>
					</li>
				</ul>
			</nav>
		</div>
	);
};

export default HeaderNav;
