# Marketplace API - Server Configuration

This is the AWS SAM (Serverless Application Model) project for the Marketplace API backend.

## Directory Structure

```
server/
├── template.yaml              # SAM template defining all resources (Lambda, DynamoDB, API Gateway, etc.)
├── samconfig.toml             # SAM CLI configuration for staging/production deployments
├── .gitignore                 # Git ignore file (excludes node_modules, .aws-sam, etc.)
│
├── layers/                    # Lambda Layers (shared code/dependencies)
│   └── myLayer/
│       └── nodejs/
│           ├── package.json   # Shared dependencies for all Lambdas
│           └── node_modules/  # (Generated after npm install - NOT committed)
│
├── handlers/                  # Lambda function handlers
│   ├── products/
│   │   ├── getProducts/
│   │   │   ├── index.js       # Handler code
│   │   │   └── package.json   # Handler metadata (no dependencies)
│   │   ├── createProduct/
│   │   ├── updateProduct/
│   │   ├── deleteProduct/
│   │   └── getProductById/
│   │
│   ├── orders/
│   ├── carts/
│   ├── reviews/
│   ├── transactions/
│   ├── payments/
│   └── notifications/
│
├── env/                       # Environment variable templates
│   ├── staging.example.env
│   ├── production.example.env
│   └── local.example.env
│
└── src/                       # (Optional) Additional shared utilities
    └── lambdas/
```

## Key Design Decisions

### 1. Shared Dependencies in Lambda Layers
- **All shared dependencies** (aws-sdk, axios, uuid, stripe) are centralized in `layers/myLayer/nodejs/package.json`
- **Each handler folder** only contains its `index.js` handler code and metadata
- **Benefits:**
  - Smaller deployment packages
  - Consistent dependency versions across all Lambdas
  - Easier dependency management
  - Automatic layer versioning with each deployment

### 2. Environment Variables
- Environment variables are defined in `template.yaml` under `Globals.Function.Environment`
- All Lambda functions inherit these variables automatically
- Sensitive values (STRIPE_SECRET_KEY) are passed as SAM parameters during deployment
- See `env/` folder for example files

### 3. Organization by Feature
- Handlers are organized by feature (products, orders, carts, etc.)
- Each handler is in its own folder with its own minimal `package.json`
- This makes it easy to locate and update specific functions

## Setup Instructions

### 1. Install Dependencies in the Layer
```bash
cd layers/myLayer/nodejs
npm install
```

### 2. Build and Deploy

**For Staging:**
```bash
sam build
sam deploy --config-env staging
```

**For Production:**
```bash
sam build
sam deploy --config-env production
```

**For Local Development:**
```bash
sam build
sam local start-api --template .aws-sam/build/template.yaml
```

### 3. Update Environment Variables
- Edit `samconfig.toml` to add real parameter values
- Or pass parameters during deploy:
  ```bash
  sam deploy --parameter-overrides \
    CognitoUserPoolArn=arn:aws:cognito-idp:... \
    StripeSecretKey=sk_test_...
  ```

## Maintaining Lambda Layers

### Adding a New Dependency
1. Update `layers/myLayer/nodejs/package.json`
2. Run `npm install` in that directory to update `node_modules`
3. Commit changes
4. Deploy: `sam build && sam deploy`

### Updating Existing Dependencies
1. Update version in `layers/myLayer/nodejs/package.json`
2. Run `npm update` to refresh `node_modules`
3. Deploy: `sam build && sam deploy`

### Creating a New Lambda Function
1. Create a new folder in `handlers/<feature>/<functionName>/`
2. Add `index.js` with your handler code
3. Add minimal `package.json` (name, description only)
4. Add function definition to `template.yaml`
5. Deploy: `sam build && sam deploy`

## Template Structure

The `template.yaml` file defines:
- **Parameters**: Configuration values (EnvironmentName, CognitoUserPoolArn, StripeSecretKey)
- **Globals**: Default settings for all Lambda functions (runtime, timeout, layers, environment variables)
- **Resources**:
  - `SharedDependenciesLayer`: The Lambda layer with shared code
  - DynamoDB Tables (Products, Carts, Orders, Reviews, Transactions)
  - API Gateway (REST API with Cognito authorization)
  - 20+ Lambda Functions organized by domain
- **Outputs**: API endpoint, table names, and resource information

## Environment Variables Reference

### Global Variables (passed to all Lambdas)
- `ENVIRONMENT_NAME`: staging or production
- `PRODUCTS_TABLE`: DynamoDB table name for products
- `CARTS_TABLE`: DynamoDB table name for shopping carts
- `ORDERS_TABLE`: DynamoDB table name for orders
- `REVIEWS_TABLE`: DynamoDB table name for reviews
- `TRANSACTIONS_TABLE`: DynamoDB table name for transactions
- `AWS_NODEJS_CONNECTION_REUSE_ENABLED`: "1" (performance optimization)

### Function-Specific Variables
- `STRIPE_SECRET_KEY`: For payment-related functions (CheckoutCartItems, CheckoutSingleItem)

## Troubleshooting

### "Layer not found" errors
- Ensure you've run `npm install` in `layers/myLayer/nodejs/`
- Rebuild: `sam build`

### "Module not found" errors
- Check that the required package is in `layers/myLayer/nodejs/package.json`
- Run `npm install` in the layer directory
- Ensure you're deploying the updated layer: `sam deploy --no-confirm-changeset`

### Large deployment packages
- Ensure handler `package.json` files have no dependencies
- All dependencies should come from the layer
- Verify `.gitignore` is excluding `node_modules` from handlers

## Deployment Workflow

1. Make code changes to handlers or layer dependencies
2. Test locally: `sam local start-api`
3. Commit changes to git
4. Run: `sam build && sam deploy --config-env staging`
5. Test in staging
6. Deploy to production: `sam deploy --config-env production`

Each deployment creates a new Lambda layer version automatically—all functions using the layer will get the updates.
