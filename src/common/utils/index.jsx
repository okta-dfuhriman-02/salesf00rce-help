import { astro } from '../assets/images';

export { default as ApiError } from './ApiError';

export const isUrl = string => {
	try {
		new URL(string);
	} catch {
		return false;
	}
	return true;
};

export const getProfilePicture = (_userInfo, _profile) => {
	const picture = _profile?.picture ?? _userInfo?.picture;

	return isUrl(picture) ? picture : astro;
};

export const getUserName = (_userInfo, _profile) => {
	const { given_name, name, nickname } = _userInfo || {};
	const { displayName, firstName, nickName } = _profile || {};

	return nickName ?? nickname ?? firstName ?? given_name ?? displayName ?? name ?? '';
};
