import { Auth, Errors, Okta, ReactQuery } from '../common';

const logoutFn = async ({
	dispatch,
	oktaAuth,
	queryClient,
	userId,
	slo = true,
	postLogoutRedirect,
}) => {
	try {
		let config = {};

		if (postLogoutRedirect) {
			config = { postLogoutRedirectUri: postLogoutRedirect };
		}
		dispatch({ type: 'LOGOUT_STARTED' });

		console.info('executing logout...');

		// 1) Clear Idp sessions and revoke all tokens
		if (slo && userId) {
			const url = `${window.location.origin}/api/v1/users/${userId}/sessions`;

			const response = await fetch(url, { method: 'DELETE' });

			if (!response.ok) {
				const json = await response.json();

				throw new Errors.ApiError({
					message: 'Unable to clear user sessions!',
					type: 'LOGOUT_FAILED',
					statusCode: response?.status,
					json,
				});
			}
		}

		// 2) Clear Session Storage
		sessionStorage.clear();

		// 3) Clear the QueryClient
		queryClient.clear();

		// 4) Do Okta Sign Out, which results in a redirect.
		return oktaAuth.signOut(config);
	} catch (error) {
		throw new Errors.AppError({ type: 'LOGOUT_FAILED', error });
	}
};

export const useLogoutMutation = options => {
	const queryClient = ReactQuery.useQueryClient();
	const { oktaAuth } = Okta.useOktaAuth();
	const dispatch = Auth.useAuthDispatch();

	return ReactQuery.useMutation(
		params => logoutFn({ ...options, dispatch, oktaAuth, queryClient, ...params }),
		{
			mutationKey: ['logout'],
		}
	);
};
