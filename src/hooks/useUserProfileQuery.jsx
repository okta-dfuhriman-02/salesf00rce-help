import { Errors, Okta, Queries, ReactQuery } from '../common';

const getUserAsync = async ({ oktaAuth, userId: _userId, user: _user, abortSignal }) => {
	let user = _user;

	const accessToken = oktaAuth.getAccessToken();
	const {
		payload: { sub, uid: loggedInUserId },
	} = oktaAuth.token.decode(accessToken);

	const userId = _userId || sub;

	const idToken = oktaAuth.getIdToken();
	const {
		payload: { idp },
	} = oktaAuth.token.decode(idToken);

	if (!user && userId) {
		const url = `${window.location.origin}/api/v1/users/${userId}`;

		const request = new Request(url);

		const requestOptions = {};

		if (abortSignal) {
			requestOptions.signal = abortSignal;
		}

		request.headers.append('Authorization', `Bearer ${accessToken}`);

		const response = await fetch(request, requestOptions);

		if (!response.ok) {
			const body = await response.json();
			throw new Errors.ApiError({ statusCode: response?.statusCode, json: JSON.stringify(body) });
		}

		user = await response.json();
	}

	if (user) {
		// set active credential
		const { credentials = [] } = user;

		const _credentials = credentials.map(credential => {
			const {
				id,
				provider: { id: idpId, name },
			} = credential;

			const isLoggedIn =
				credentials.length === 1 ||
				(credentials.length === 2 && ['email', 'password'].includes(name)) ||
				(id === loggedInUserId && idpId === idp) ||
				(id === loggedInUserId && ['email', 'password'].includes(name));

			return { ...credential, isLoggedIn };
		});

		return {
			...user,
			credentials: _credentials,
		};
	}
};

const userProfileQueryFn = async options => {
	const { authState, oktaAuth } = options || {};

	const isAuthenticated = authState?.isAuthenticated || (await oktaAuth.isAuthenticated());

	if (!isAuthenticated) {
		throw new Errors.AppError({ type: 'USER_FETCH_FAILED', message: 'Not authenticated!' });
	}

	try {
		const user = await getUserAsync(options);

		return user;
	} catch (error) {
		throw new Errors.AppError({ type: 'USER_INFO_FETCH_FAILED', error });
	}
};

export const useUserProfileQuery = options => {
	try {
		const { data: _userInfo } = Queries.useUserInfoQuery();

		const isPendingAccountLink = ReactQuery.useIsMutating(['account-link']);

		const userInfo = options?.userInfo || _userInfo;

		const oktaAuth = Okta.useOktaAuth();

		return ReactQuery.useQuery(
			['user', 'profile'],
			() => userProfileQueryFn({ ...options, ...oktaAuth }),
			{
				enabled: isPendingAccountLink ? false : !!userInfo,
				retry: 6,
			}
		);
	} catch (error) {
		throw new Errors.AppError({ message: 'useUserProfileQuery init error', error });
	}
};
