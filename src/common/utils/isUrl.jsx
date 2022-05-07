export const isUrl = string => {
	try {
		new URL(string);
	} catch {
		return false;
	}
	return true;
};
