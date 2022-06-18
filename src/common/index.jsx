// Okta SDKs
import * as OktaAuthJs from '@okta/okta-auth-js';
import * as OktaReact from '@okta/okta-react';
import PropTypes from 'prop-types';

import { AuthReducer, initialState } from '../providers/AuthProvider/AuthReducer';
import useAuthState from '../hooks/useAuthState';
import useAuthDispatch from '../hooks/useAuthDispatch';
import * as Hooks from '../hooks';

export { Images, Icons } from './assets/images';

export const Auth = {
	Reducer: AuthReducer,
	initialState,
	silentAuth: Hooks.silentAuth,
	signInWithRedirect: Hooks.signInWithRedirect,
	useAuthDispatch,
	useAuthState,
	userInfoQuery: Hooks.userInfoQueryFn,
};

export const Okta = {
	Auth: OktaAuthJs.OktaAuth,
	...OktaReact,
	...OktaAuthJs,
};

export { PropTypes };

export const Mutations = Hooks.Mutations;
export const Queries = Hooks.Queries;
export const useLockBodyScroll = Hooks.useLockBodyScroll;
export const useBodyClass = Hooks.useBodyClass;

export * as _ from 'lodash';
export * as LDS from '@salesforce/design-system-react';
export * as React from 'react';
export * as ReactQuery from 'react-query';
export * as ReactRouter from 'react-router-dom';

export * as Errors from './Errors';
export * as Utils from './utils';
