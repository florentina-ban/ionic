import React, { useContext, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { IonButton, IonCard, IonCardContent, IonCardTitle, IonContent, IonHeader, IonInput, IonLoading, IonPage, IonText, IonTitle, IonToolbar } from '@ionic/react';
import { AuthContext } from './authProvider';
import { getLogger } from '../../core/logger';
import './auth.css'

const log = getLogger('Login');

interface LoginState {
  username?: string;
  password?: string;
}

export const Login: React.FC<RouteComponentProps> = ({ history }) => {
  const { isAuthenticated, isAuthenticating, isRegistered, isRegistering, login, register, registerError ,authenticationError } = useContext(AuthContext);
  const [state, setState] = useState<LoginState>({});
  const { username, password } = state;
  const handleLogin = () => {
    log('handleLogin...');
    login?.(username, password);
  };
  const handleRegister = () => {
    log('handleRegister...');
    register?.(username, password);
  };
  log('render');
  if (isAuthenticated) {
    return <Redirect to={{ pathname: '/' }} />
  }
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="tertiary">
          <IonTitle>Cool Recipies App - Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonCard id="loginCard">
          <IonCardTitle id="cardTitle">Login</IonCardTitle>
          <IonCardContent id="cardContent">
            <IonInput
              placeholder="Username"
              value={username}
              onIonChange={e => setState({
                ...state,
                username: e.detail.value || ''
              })}/>
            <IonInput
              placeholder="Password"
              value={password}
              onIonChange={e => setState({
                ...state,
                password: e.detail.value || ''
              })}/>
              <IonLoading isOpen={isAuthenticating}/>
              {authenticationError && (
                <IonText id="errorText">{'Failed to authenticate: '+authenticationError.message }</IonText>
              )}
              <IonButton id="loginButton" onClick={handleLogin}>Login</IonButton>
              <IonButton id="registerButton" onClick={handleRegister}>Register</IonButton>
            </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Login;