import { LDS, useLockBodyScroll } from '../../common';
const PageSpinner = props => {
	useLockBodyScroll();
	return <LDS.Spinner {...props} />;
};

export default PageSpinner;
