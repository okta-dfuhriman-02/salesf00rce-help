import { Okta, ReactQuery } from '../common';

const getUserInfoAsync = async oktaAuth => {
	const userInfo = await oktaAuth.getUser();

	if (userInfo) {
		if (userInfo.headers) {
			delete userInfo.headers;
		}

		return userInfo;
	}
};

export const userInfoQueryFn = async ({ dispatch, authState, oktaAuth }) => {
	const isAuthenticated =
		authState?.isAuthenticated || (await oktaAuth?.isAuthenticated()) || false;

	if (!isAuthenticated) {
		throw new Error('Not authenticated!');
	}

	try {
		if (dispatch) {
			dispatch({
				type: 'USER_INFO_FETCH_STARTED',
			});
		} else {
			console.log('no dispatch!');
		}

		const userInfo = await getUserInfoAsync(oktaAuth);

		if (dispatch) {
			dispatch({ type: 'USER_INFO_FETCH_SUCCEEDED' });
		}

		return userInfo;
	} catch (error) {
		if (dispatch) {
			console.log(error);
			dispatch({ type: 'USER_INFO_FETCH_FAILED', error });
		} else {
			throw new Error(error);
		}
	}
};

export const useUserInfoQuery = dispatch => {
	try {
		const oktaAuth = Okta.useOktaAuth();

		const isPendingAccountLink = ReactQuery.useIsMutating(['account-link']);

		return ReactQuery.useQuery(['user', 'info'], () => userInfoQueryFn({ dispatch, ...oktaAuth }), {
			retry: 6,
			enabled: isPendingAccountLink === 0,
		});
	} catch (error) {
		throw new Error(`useUserQuery init error [${error}]`);
	}
};
