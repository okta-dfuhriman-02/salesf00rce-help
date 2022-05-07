import React, { Fragment, createContext, useEffect, useReducer, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import * as _ from 'lodash';

// Okta SDKs
import {
	OktaAuth,
	toRelativeUrl,
	removeNils,
	getOAuthUrls,
	toQueryString,
} from '@okta/okta-auth-js';
import { LoginCallback, SecureRoute, Security, useOktaAuth } from '@okta/okta-react';
import { authConfig } from './config/authConfig';

import AuthProvider from '../providers/AuthProvider/AuthContext';
import AuthDispatchContext from '../providers/AuthProvider/AuthDispatcher';
import useAuthActions from '../hooks/useAuthActions';
import useAuthDispatch from '../hooks/useAuthDispatch';
import useAuthState from '../hooks/useAuthState';

import * as LDS from '@salesforce/design-system-react';

const Auth = {
	Provider: AuthProvider,
	DispatchContext: AuthDispatchContext,
	useAuthDispatch,
	useAuthState,
	useAuthActions,
};

const Okta = {
	Auth: OktaAuth,
	LoginCallback,
	Security,
	SecureRoute,
	toRelativeUrl,
	useOktaAuth,
	removeNils,
	getOAuthUrls,
	toQueryString,
	config: authConfig,
};

export {
	Auth,
	React,
	Fragment,
	Link,
	createContext,
	useEffect,
	useReducer,
	useState,
	Okta,
	PropTypes,
	_,
	LDS,
};

export * from './assets/images';
export { default as ApiError } from './utils/ApiError';
export * from './utils/isUrl';
