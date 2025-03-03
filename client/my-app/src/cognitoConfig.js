import { CognitoUserPool } from "amazon-cognito-identity-js";

const poolData = {
  UserPoolId: "us-east-1_7ghRzH5eB", // e.g., us-east-1_XXXXXXX
  ClientId: "1ured81pno22gmls6k0ciiakom", // Found under App Clients in Cognito
};

export const userPool = new CognitoUserPool(poolData);
