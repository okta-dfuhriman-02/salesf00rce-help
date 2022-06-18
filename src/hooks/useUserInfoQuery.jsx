import { Errors, Okta, ReactQuery } from '../common';

const getUserInfoAsync = async oktaAuth => {
	const userInfo = await oktaAuth.getUser();

	if (userInfo) {
		if (userInfo.headers) {
			delete userInfo.headers;
		}

		return userInfo;
	}
};

export const userInfoQueryFn = async ({ authState, oktaAuth }) => {
	const isAuthenticated =
		authState?.isAuthenticated || (await oktaAuth?.isAuthenticated()) || false;

	if (!isAuthenticated) {
		throw new Error('Not authenticated!');
	}

	try {
		const userInfo = await getUserInfoAsync(oktaAuth);

		return userInfo;
	} catch (error) {
		throw new Errors.AppError({ type: 'USER_INFO_FETCH_FAILED', error });
	}
};

export const useUserInfoQuery = () => {
	try {
		const oktaAuth = Okta.useOktaAuth();

		const isPendingAccountLink = ReactQuery.useIsMutating(['account-link']);

		return ReactQuery.useQuery(['user', 'info'], () => userInfoQueryFn({ ...oktaAuth }), {
			retry: 6,
			enabled: isPendingAccountLink === 0,
		});
	} catch (error) {
		throw new Errors.AppError({ type: 'USER_QUERY_INIT_FAILED', error });
	}
};
