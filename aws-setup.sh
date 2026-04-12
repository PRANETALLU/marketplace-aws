#!/bin/bash
# AWS Setup Script for Marketplace Deployment Pipeline
# This script automates AWS infrastructure preparation for GitHub Actions deployment

set -e

echo "🚀 Marketplace AWS Setup Script"
echo "================================"

# Check prerequisites
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI not found. Please install it first."
    exit 1
fi

# Get AWS Account ID
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
echo "✓ AWS Account ID: $ACCOUNT_ID"

read -p "Enter your GitHub username/org: " GITHUB_ORG
read -p "Enter your GitHub repository name: " GITHUB_REPO
read -p "Enter AWS region (default: us-east-1): " AWS_REGION
AWS_REGION=${AWS_REGION:-us-east-1}

echo ""
echo "📝 Step 1: Creating S3 buckets for client hosting..."

# Create S3 buckets
STAGING_BUCKET="marketplace-client-staging-$ACCOUNT_ID"
PRODUCTION_BUCKET="marketplace-client-production-$ACCOUNT_ID"

for BUCKET in $STAGING_BUCKET $PRODUCTION_BUCKET; do
    if aws s3 ls "s3://$BUCKET" 2>/dev/null; then
        echo "✓ Bucket $BUCKET already exists"
    else
        echo "  Creating bucket $BUCKET..."
        aws s3 mb "s3://$BUCKET" --region "$AWS_REGION"
        echo "✓ Created $BUCKET"
    fi
done

# Enable static website hosting
for BUCKET in $STAGING_BUCKET $PRODUCTION_BUCKET; do
    echo "  Enabling static website hosting on $BUCKET..."
    aws s3 website "s3://$BUCKET/" \
        --index-document index.html \
        --error-document index.html \
        --region "$AWS_REGION"
    echo "✓ Website hosting enabled on $BUCKET"
done

echo ""
echo "🔐 Step 2: Creating IAM role for GitHub Actions..."

# Create trust policy document
cat > /tmp/trust-policy.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::$ACCOUNT_ID:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:$GITHUB_ORG/$GITHUB_REPO:*"
        }
      }
    }
  ]
}
EOF

# Create permissions policy
cat > /tmp/permissions-policy.json <<'EOF'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "cloudformation:*",
        "s3:*",
        "lambda:*",
        "dynamodb:*",
        "apigateway:*",
        "iam:PassRole",
        "iam:GetRole",
        "iam:CreateRole",
        "iam:PutRolePolicy",
        "iam:AttachRolePolicy",
        "logs:*",
        "cloudfront:CreateInvalidation"
      ],
      "Resource": "*"
    }
  ]
}
EOF

ROLE_NAME="marketplace-github-actions-role"

# Check if role exists
if aws iam get-role --role-name "$ROLE_NAME" 2>/dev/null; then
    echo "✓ Role $ROLE_NAME already exists"
    # Update trust policy
    aws iam update-assume-role-policy \
        --role-name "$ROLE_NAME" \
        --policy-document file:///tmp/trust-policy.json
    echo "✓ Updated trust policy"
else
    echo "  Creating role $ROLE_NAME..."
    aws iam create-role \
        --role-name "$ROLE_NAME" \
        --assume-role-policy-document file:///tmp/trust-policy.json
    echo "✓ Created role $ROLE_NAME"
fi

# Attach permissions policy
echo "  Attaching permissions policy..."
aws iam put-role-policy \
    --role-name "$ROLE_NAME" \
    --policy-name "marketplace-deployment-policy" \
    --policy-document file:///tmp/permissions-policy.json
echo "✓ Permissions policy attached"

ROLE_ARN="arn:aws:iam::$ACCOUNT_ID:role/$ROLE_NAME"
echo "✓ Role ARN: $ROLE_ARN"

echo ""
echo "📋 Step 3: Gathering required secrets..."

read -p "Enter Cognito User Pool ARN (staging): " COGNITO_ARN
read -s -p "Enter Stripe Secret Key (test key for staging): " STRIPE_KEY
echo ""

echo ""
echo "✅ AWS Setup Complete!"
echo ""
echo "📌 Add these as GitHub Secrets (Settings → Secrets and variables → Actions):"
echo ""
echo "AWS_ROLE_TO_ASSUME: $ROLE_ARN"
echo "AWS_ACCOUNT_ID: $ACCOUNT_ID"
echo "COGNITO_USER_POOL_ARN: $COGNITO_ARN"
echo "STRIPE_SECRET_KEY: (use test/live key as appropriate)"
echo ""
echo "📌 S3 Buckets Created:"
echo "Staging: $STAGING_BUCKET"
echo "Production: $PRODUCTION_BUCKET"
echo ""
echo "🔗 Next: Add these secrets to GitHub, then push to 'staging' or 'main' branch to deploy!"

# Cleanup
rm -f /tmp/trust-policy.json /tmp/permissions-policy.json
