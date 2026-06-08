const AWS = require("aws-sdk");
const https = require("https");
const url = require("url");

const cognito = new AWS.CognitoIdentityServiceProvider();

// Sends the required response back to CloudFormation's pre-signed S3 URL
const sendCfnResponse = (event, status, data = {}, reason = "") => {
  const body = JSON.stringify({
    Status: status,
    Reason: reason || "See CloudWatch logs for details",
    PhysicalResourceId: `cognito-presignup-trigger-${event.ResourceProperties.UserPoolId}`,
    StackId: event.StackId,
    RequestId: event.RequestId,
    LogicalResourceId: event.LogicalResourceId,
    Data: data,
  });

  return new Promise((resolve, reject) => {
    const parsed = url.parse(event.ResponseURL);
    const req = https.request(
      {
        hostname: parsed.hostname,
        port: 443,
        path: parsed.path,
        method: "PUT",
        headers: {
          "Content-Type": "",
          "Content-Length": Buffer.byteLength(body),
        },
      },
      resolve
    );
    req.on("error", reject);
    req.write(body);
    req.end();
  });
};

exports.handler = async (event) => {
  console.log("Cognito trigger attacher event:", JSON.stringify(event));
  const { UserPoolId, PreSignUpLambdaArn } = event.ResourceProperties;

  try {
    if (event.RequestType === "Delete") {
      // On stack deletion, clear the Pre Sign-up trigger
      await cognito.updateUserPool({
        UserPoolId,
        LambdaConfig: {},
      }).promise();
    } else {
      // On Create or Update, attach the Pre Sign-up trigger
      await cognito.updateUserPool({
        UserPoolId,
        LambdaConfig: { PreSignUp: PreSignUpLambdaArn },
      }).promise();
      console.log(`Pre Sign-up trigger attached: ${PreSignUpLambdaArn} → pool ${UserPoolId}`);
    }

    await sendCfnResponse(event, "SUCCESS");
  } catch (err) {
    console.error("Failed to update Cognito User Pool:", err);
    // Still respond SUCCESS on delete failures (pool may already be gone)
    if (event.RequestType === "Delete") {
      await sendCfnResponse(event, "SUCCESS");
    } else {
      await sendCfnResponse(event, "FAILED", {}, err.message);
    }
  }
};
