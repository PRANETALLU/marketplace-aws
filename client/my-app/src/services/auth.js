import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserAttribute
} from 'amazon-cognito-identity-js';

const poolData = {
  UserPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID, // Replace with your User Pool ID
  ClientId: import.meta.env.VITE_COGNITO_CLIENT_ID, // Replace with your App Client ID
};

const userPool = new CognitoUserPool(poolData);

// === SIGN UP ===
export const signUp = (username, email, password) => {
  return new Promise((resolve, reject) => {
    const attributes = [new CognitoUserAttribute({ Name: 'email', Value: email })];

    userPool.signUp(username, password, attributes, null, (err, result) => {
      if (err) return reject(err);
      resolve(result); // Immediately confirmed if PreSignUp Lambda auto-confirms
    });
  });
};

// === SIGN IN ===
export const signIn = (username, password) => {
  return new Promise((resolve, reject) => {
    const authDetails = new AuthenticationDetails({ Username: username, Password: password });
    const cognitoUser = new CognitoUser({ Username: username, Pool: userPool });

    cognitoUser.authenticateUser(authDetails, {
      onSuccess: (session) => {
        resolve({
          idToken: session.getIdToken().getJwtToken(),
          accessToken: session.getAccessToken().getJwtToken(),
          refreshToken: session.getRefreshToken().getToken(),
          cognitoUser
        });
      },
      onFailure: (err) => reject(err),
    });
  });
};

// === SIGN OUT ===
export const signOut = () => {
  const user = userPool.getCurrentUser();
  if (user) user.signOut();
};

// === GET CURRENT USER ===
export const getCurrentUser = () => userPool.getCurrentUser();

// === GET CURRENT USER INFO ===
export const getCurrentUserInfo = () =>
  new Promise((resolve, reject) => {
    const user = userPool.getCurrentUser();
    if (!user) return resolve(null);

    user.getSession((err, session) => {
      if (err) return reject(err);
      if (!session.isValid()) return reject(new Error('Invalid session'));
      resolve(session.getIdToken().payload);
    });
  });

// === GET ID TOKEN ===
export const getIdToken = () =>
  new Promise((resolve, reject) => {
    const user = userPool.getCurrentUser();
    if (!user) return resolve(null);

    user.getSession((err, session) => {
      if (err) return reject(err);
      if (!session.isValid()) return resolve(null);
      resolve(session.getIdToken().getJwtToken());
    });
  });
