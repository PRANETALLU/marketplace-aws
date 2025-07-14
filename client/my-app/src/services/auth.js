import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserSession,
  CognitoIdToken, CognitoAccessToken, CognitoRefreshToken
} from 'amazon-cognito-identity-js';
import CryptoJS from 'crypto-js';
import {
  CognitoIdentityProviderClient,
  SignUpCommand,
  ConfirmSignUpCommand,
  ForgotPasswordCommand,
  ConfirmForgotPasswordCommand,
  InitiateAuthCommand
} from '@aws-sdk/client-cognito-identity-provider';

// === Configuration ===
const poolData = {
  UserPoolId: 'us-east-1_dvNTAmtBP',
  ClientId: '6ot81flsno51rkmtomflf4l5qj',
};
const clientSecret = '13lgedajp0rgle9b95hrtrt1qb6m80u91qsj33nmu45u773j232j';

const userPool = new CognitoUserPool(poolData);
const client = new CognitoIdentityProviderClient({ region: 'us-east-1' });

// === Secret Hash Helper ===
const generateSecretHash = (username) => {
  const message = username + poolData.ClientId;
  const hash = CryptoJS.HmacSHA256(message, clientSecret);
  return CryptoJS.enc.Base64.stringify(hash);
};

// === SIGN UP ===
export const signUp = async (username, email, password) => {
  const command = new SignUpCommand({
    ClientId: poolData.ClientId,
    Username: username,
    Password: password,
    //SecretHash: generateSecretHash(username),
    UserAttributes: [
      { Name: 'email', Value: email },
    ],
  });

  try {
    return await client.send(command);
  } catch (err) {
    console.error('Sign up error:', err);
    throw new Error(err.message || 'Signup failed');
  }
};

// === CONFIRM SIGN UP ===
export const confirmSignUp = async (username, code) => {
  const command = new ConfirmSignUpCommand({
    ClientId: poolData.ClientId,
    Username: username,
    ConfirmationCode: code,
    //SecretHash: generateSecretHash(username),
  });

  try {
    return await client.send(command);
  } catch (err) {
    console.error('Confirm sign up error:', err);
    throw new Error(err.message || 'Confirmation failed');
  }
};

// === SIGN IN ===
export const signIn = async (username, password) => {
  const command = new InitiateAuthCommand({
    AuthFlow: 'USER_PASSWORD_AUTH',
    ClientId: poolData.ClientId,
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password,
      //SECRET_HASH: generateSecretHash(username),
    },
  });

  try {
    const response = await client.send(command);
    console.log('Login response received');

    if (!response) {
      console.error('No response received from Cognito');
      throw new Error('Authentication failed: No response received');
    }

    if (!response.AuthenticationResult) {
      console.error('Missing AuthenticationResult in response:', response);
      throw new Error('Authentication failed: Invalid response format');
    }

    const { AccessToken, IdToken, RefreshToken } = response.AuthenticationResult;

    if (!AccessToken || !IdToken) {
      console.error('Missing tokens in response:', response.AuthenticationResult);
      throw new Error('Authentication failed: Missing required tokens');
    }

    // Store the user session in Cognito's local storage
    const cognitoUser = new CognitoUser({
      Username: username,
      Pool: userPool
    });

    const idToken = new CognitoIdToken({ IdToken });
    const accessToken = new CognitoAccessToken({ AccessToken });
    const refreshToken = new CognitoRefreshToken({ RefreshToken });

    const sessionData = {
      IdToken: idToken,
      AccessToken: accessToken,
      RefreshToken: refreshToken
    };

    cognitoUser.setSignInUserSession(
      new CognitoUserSession(sessionData)
    );

    // Return the tokens
    return {
      accessToken: AccessToken,
      idToken: IdToken,
      refreshToken: RefreshToken,
      user: cognitoUser
    };
  } catch (err) {
    console.error('Authentication error:', err);
    throw new Error(err.message || 'Authentication failed');
  }
};

// === SIGN OUT ===
export const signOut = () => {
  const cognitoUser = userPool.getCurrentUser();
  if (cognitoUser) {
    cognitoUser.signOut();
    console.log('User signed out successfully');
  }
  return Promise.resolve();
};

// === GET ID TOKEN ===
export const getIdToken = () => {
  return new Promise((resolve, reject) => {
    const cognitoUser = userPool.getCurrentUser();

    if (!cognitoUser) {
      console.log('No current user found');
      return resolve(null);
    }

    cognitoUser.getSession((err, session) => {
      if (err) {
        console.error('Error getting session:', err);
        return reject(err);
      }

      if (!session || !session.isValid()) {
        console.error('Invalid session');
        return reject(new Error('Invalid session'));
      }

      resolve(session.getIdToken().getJwtToken());
    });
  });
};

// === GET CURRENT USER ===
export const getCurrentUser = () => {
  return userPool.getCurrentUser();
};

// === GET CURRENT USER INFO ===
export const getCurrentUserInfo = () => {
  return new Promise((resolve, reject) => {
    const cognitoUser = userPool.getCurrentUser();

    if (!cognitoUser) {
      return resolve(null);
    }

    cognitoUser.getSession((err, session) => {
      if (err) {
        console.error('Error getting user session:', err);
        return reject(err);
      }

      if (!session.isValid()) {
        console.error('Session not valid');
        return reject(new Error('Invalid session'));
      }

      // Return user payload from ID token
      resolve(session.getIdToken().payload);
    });
  });
};

// === FORGOT PASSWORD ===
export const forgotPassword = async (username) => {
  const command = new ForgotPasswordCommand({
    ClientId: poolData.ClientId,
    Username: username,
    //SecretHash: generateSecretHash(username),
  });

  try {
    return await client.send(command);
  } catch (err) {
    console.error('Forgot password error:', err);
    throw new Error(err.message || 'Forgot password request failed');
  }
};

// === CONFIRM FORGOT PASSWORD ===
export const confirmForgotPassword = async (username, code, newPassword) => {
  const command = new ConfirmForgotPasswordCommand({
    ClientId: poolData.ClientId,
    Username: username,
    ConfirmationCode: code,
    Password: newPassword,
    //SecretHash: generateSecretHash(username),
  });

  try {
    return await client.send(command);
  } catch (err) {
    console.error('Confirm forgot password error:', err);
    throw new Error(err.message || 'Password reset failed');
  }
};