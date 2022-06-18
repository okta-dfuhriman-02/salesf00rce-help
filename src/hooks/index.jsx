import { useLoginMutation, silentAuth, signInWithRedirect } from './useLoginMutation';
import { useLogoutMutation } from './useLogoutMutation';
import { useUserInfoQuery, userInfoQueryFn } from './useUserInfoQuery';
import { useUserProfileQuery } from './useUserProfileQuery';

export const Mutations = {
	useLoginMutation,
	useLogoutMutation,
};

export const Queries = {
	useUserInfoQuery,
	useUserProfileQuery,
};

export { silentAuth, signInWithRedirect, userInfoQueryFn };

export * from './useAuthDispatch';
export * from './useAuthState';
export * from './useBodyClass';
export * from './useLockBodyScroll';
