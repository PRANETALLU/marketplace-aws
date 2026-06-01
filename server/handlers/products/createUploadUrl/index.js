const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

const s3 = new AWS.S3({ signatureVersion: "v4" });

const PRODUCT_IMAGES_BUCKET = process.env.PRODUCT_IMAGES_BUCKET;
const AWS_REGION = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || "us-east-1";
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
  "Access-Control-Allow-Methods": "POST,OPTIONS",
};

const response = (statusCode, body) => ({
  statusCode,
  headers: corsHeaders,
  body: JSON.stringify(body),
});

const getClaims = (event) => {
  const authorizerClaims = event.requestContext?.authorizer?.claims;
  if (authorizerClaims) return authorizerClaims;

  const authorization = event.headers?.Authorization || event.headers?.authorization;
  const token = authorization?.startsWith("Bearer ") ? authorization.slice(7) : null;
  if (!token) return null;

  try {
    const payload = token.split(".")[1];
    return JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
  } catch (error) {
    console.error("Invalid authorization token:", error);
    return null;
  }
};

const extensionForContentType = (contentType, fileName = "") => {
  const extensionFromName = fileName.toLowerCase().match(/\.(jpe?g|png|webp|gif)$/)?.[0];
  if (extensionFromName) return extensionFromName;

  const extensions = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
  };

  return extensions[contentType] || "";
};

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders, body: "" };
  }

  if (!PRODUCT_IMAGES_BUCKET) {
    return response(500, { message: "Product image bucket is not configured." });
  }

  const claims = getClaims(event);
  const userId = claims?.sub;

  if (!userId) {
    return response(401, { message: "Unauthorized. Login required." });
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch (error) {
    return response(400, { message: "Invalid request body." });
  }

  const contentType = body.contentType;
  if (!ALLOWED_IMAGE_TYPES.has(contentType)) {
    return response(400, { message: "Only JPEG, PNG, WebP, and GIF product images are supported." });
  }

  const extension = extensionForContentType(contentType, body.fileName);
  const imageKey = `product-images/${userId}/${uuidv4()}${extension}`;
  const uploadUrl = await s3.getSignedUrlPromise("putObject", {
    Bucket: PRODUCT_IMAGES_BUCKET,
    Key: imageKey,
    ContentType: contentType,
    Expires: 300,
  });

  return response(200, {
    uploadUrl,
    imageKey,
    imageUrl: `https://${PRODUCT_IMAGES_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${imageKey}`,
  });
};
