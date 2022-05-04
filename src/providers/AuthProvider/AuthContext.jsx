/* eslint-disable react-hooks/exhaustive-deps */
/** @format */

import { PropTypes, React } from '../../common';
import { AuthReducer, initialState, initializeState } from './AuthReducer';
import AuthDispatchContext from './AuthDispatcher';

export const AuthStateContext = React.createContext();

const AuthProvider = ({ children }) => {
	const [state, dispatch] = React.useReducer(AuthReducer, initialState, initializeState);

	// eslint-disable-next-line react/jsx-no-constructed-context-values
	const contextValues = {
		...state,
	};

	return (
		<AuthStateContext.Provider value={contextValues}>
			<AuthDispatchContext.Provider value={dispatch}>{children}</AuthDispatchContext.Provider>
		</AuthStateContext.Provider>
	);
};

AuthProvider.propTypes = {
	children: PropTypes.node,
};

export default AuthProvider;
