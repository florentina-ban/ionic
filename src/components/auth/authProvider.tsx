import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getLogger } from './../../core/logger';
import { login as loginApi } from './authApi';
import { register as registerApi } from './authApi';
import { set as setStorage, get as getStorage, clear as clearStorage } from './../localStorage/localStorageApi';

const log = getLogger('AuthProvider');

type LoginFn = (username?: string, password?: string) => void;
type LogoutFn = () => void;
type RegisterFn = (username?: string, password?: string) => void;


export interface AuthState {
  authenticationError: Error | null;
  isAuthenticated: boolean;
  isAuthenticating: boolean;
  isRegistering: boolean;
  isRegistered: boolean;
  registerError: Error | null;
  login?: LoginFn;
  register?: RegisterFn;
  logout? : LogoutFn;
  pendingAuthentication?: boolean;
  pendingRegistration?:boolean;
  username?: string;
  password?: string;
  token: string;
}

const initialState: AuthState = {
  isAuthenticated: false,
  isAuthenticating: false,
  authenticationError: null,
  isRegistered: false,
  isRegistering: false,
  registerError: null,
  pendingAuthentication: false,
  pendingRegistration: false,
  token: '',
};

export const AuthContext = React.createContext<AuthState>(initialState);

interface AuthProviderProps {
  children: PropTypes.ReactNodeLike,
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>(initialState);
  const { isAuthenticated, isAuthenticating, authenticationError,isRegistered, isRegistering, registerError, pendingAuthentication,pendingRegistration, token } = state;
  const login = useCallback<LoginFn>(loginCallback, []);
  const register = useCallback<RegisterFn>(registerCallback, []);
  const logout = useCallback<LogoutFn>(logoutCallback, []);

  useEffect(authenticationEffect, [pendingAuthentication]);
  useEffect(registerEffect, [pendingRegistration]);
  useEffect(localStorageEffect, [pendingAuthentication]);


  const value = { isAuthenticated,isRegistered, isRegistering, registerError, login, logout, register, isAuthenticating, authenticationError, token };
  log('render');
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );

  function loginCallback(username?: string, password?: string): void {
    log('login');
    setState({
      ...state,
      pendingAuthentication: true,
      username,
      password
    });
  }

  function registerCallback(username?: string, password?: string): void {
    log('register');
    setState({
      ...state,
      pendingRegistration: true,
      username,
      password
    });   
  }
  function logoutCallback(): void {
    log('logout');
    clearStorage();
    setState({
      isAuthenticated: false,
      isAuthenticating: false,
      authenticationError: null,
      isRegistered: false,
      isRegistering: false,
      registerError: null,
      pendingAuthentication: false,
      pendingRegistration: false,
      token: '',
    });   
  }

  function localStorageEffect(){
    
    getToken();
    async function getToken() {    
      getStorage('token').then(function (res) {
        if ( res.value && res.value.length>0){
            const { myValue } = JSON.parse(res.value);
            log("token: ", myValue);
            log("token_res: ", res);
            const token  = myValue;
            setState({
              ...state,
              token,
              pendingRegistration: false,
              isAuthenticated: true,
              isAuthenticating: false,  
          });
        }
      });
    }
  }

  function registerEffect() {
    let canceled = false;
    register();
    return () => {
      canceled = true;
    }

    async function register() {
      if (! pendingRegistration) {
        log('register, !pendingRegistration, return');
        return;
      }
      try {
        log('register...');
        setState({
          ...state,
          isRegistering: true,
        });
        const { username, password } = state;
        const { token } = await registerApi(username, password);
        if (canceled) {
          return;
        }
        log('register succeeded');
        setStorage('token', token);
        setState({
          ...state,
          token,
          pendingRegistration: false,
          isAuthenticated: true,
          isAuthenticating: false,
          isRegistering: false,
          
        });
      } catch (error) {
        if (canceled) {
          return;
        }
        log('register failed');
        setState({
          ...state,
          registerError: error,
          pendingRegistration: false,
          isRegistering: false,
        });
      }
    }
  }


  function authenticationEffect() {
    let canceled = false;
    authenticate();
    return () => {
      canceled = true;
    }

    async function authenticate() {
      if (!pendingAuthentication) {
        log('authenticate, !pendingAuthentication, return');
        return;
      }
      try {
        log('authenticate...');
        setState({
          ...state,
          isAuthenticating: true,
        });
        const { username, password } = state;
        const { token } = await loginApi(username, password);
        log("token: ", token);
        if (canceled) {
          return;
        }
        log('authenticate succeeded');
        setStorage('token',token);
        setState({
          ...state,
          token,
          pendingAuthentication: false,
          isAuthenticated: true,
          isAuthenticating: false,
        });
      } catch (error) {
        if (canceled) {
          return;
        }
        log('authenticate failed');
        setState({
          ...state,
          authenticationError: error,
          pendingAuthentication: false,
          isAuthenticating: false,
        });
      }
    }
  }
 
};
