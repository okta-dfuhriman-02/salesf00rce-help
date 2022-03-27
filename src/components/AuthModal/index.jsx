/* eslint-disable react-hooks/exhaustive-deps */
import { Auth, LDS, useEffect, PropTypes } from '../../common';
import { actions } from '../../providers/AuthProvider/AuthReducer';

const ENV = process.env.NODE_ENV;
const ORIGINS = process.env.REACT_APP_ORIGIN_ALLOW?.split(/, {0,2}/) || [window.location.origin];

const AuthModal = ({ onClose }) => {
	const { isVisibleAuthModal, isVisibleIframe, isLoadingLogin, authUrl, tokenParams } =
		Auth.useAuthState();
	const { login } = Auth.useAuthActions();
	const dispatch = Auth.useAuthDispatch();

	const ALLOW = process.env.REACT_APP_ALLOW;
	const modalWidth = '400px';
	const modalHeight = '650px';

	const onCancel = () => {
		dispatch({ type: actions.login.cancel.type });
		return onClose ? onClose() : () => {};
	};

	useEffect(() => {
		if (isVisibleAuthModal) {
			login(dispatch);
		}
	}, [isVisibleAuthModal]);

	useEffect(() => {
		if (tokenParams?.authorizationCode) {
			return login(dispatch, { tokenParams });
		}
	}, [tokenParams]);

	useEffect(() => {
		const responseHandler = ({ origin, data }) => {
			if (ENV === 'production') {
				const isAllowed = ORIGINS.includes(origin);

				if (!isAllowed) {
					return dispatch({
						type: actions.login.error.type,
						payload: { isVisibleIframe: false, isVisibleAuthModal: false },
						error: `'origin [${origin}] not allowed`,
					});
				}
			}

			if (data?.type === 'onload' && data?.result === 'success') {
				return dispatch({ type: actions.login.started.type });
			}

			if (data?.code) {
				dispatch({
					type: actions.login.codeExchange.type,
					payload: {
						tokenParams: {
							...tokenParams,
							authorizationCode: data?.code,
							interactionCode: data?.interaction_code,
						},
					},
				});
			}
		};

		const resolve = error => {
			if (error) {
				throw error;
			}
			window.removeEventListener('message', responseHandler);
		};

		if (isVisibleAuthModal) {
			window.addEventListener('message', responseHandler);
		}

		return () => resolve();
	}, [isVisibleAuthModal]);

	return (
		<LDS.Modal isOpen={isVisibleAuthModal} onRequestClose={onCancel}>
			{isLoadingLogin && <p>Loading...</p>}
			{authUrl && isVisibleIframe && (
				<iframe
					src={authUrl}
					name='iframe-auth'
					title='Login'
					width={modalWidth}
					height={modalHeight}
					frameBorder='0'
					style={{ display: 'block', borderRadius: '4px' }}
					allow={ALLOW}
				/>
			)}
		</LDS.Modal>
	);
};

AuthModal.propTypes = {
	onClose: PropTypes.func,
};

export default AuthModal;