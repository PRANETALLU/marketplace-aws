# 🛒 Digital Marketplace

*A dual-role e-commerce platform where users can buy and sell products, similar to Etsy, eBay, or Amazon Marketplace. Users manage their own listings while the platform facilitates secure transactions.*

---

## 📑 Table of Contents
1. [About the Project](#about-the-project)  
2. [Features](#features)  
3. [Tech Stack](#tech-stack)  
4. [Architecture Overview](#architecture-overview)  
5. [Key Feature Breakdown](#key-feature-breakdown)  
6. [Pages Overview](#pages-overview)  
7. [Advanced Features](#advanced-features)  
8. [Why This Project Stands Out](#why-this-project-stands-out)  
9. [Installation & Setup](#installation--setup)  
10. [Usage](#usage)  
11. [License](#license)  
12. [Contact](#contact)  

---

## 📝 About the Project
A digital marketplace platform where users can **both buy and sell products**. The platform does not own inventory but enables secure transactions between buyers and sellers.  
It supports features like product listings, reviews, payments, and order management.

---

## ✅ Features
- Dual-role user accounts (buy and sell)  
- Multi-vendor product listings  
- Product catalog managed by users  
- Commission-based revenue model  
- Secure payments via Stripe Connect  
- Authentication with AWS Cognito or JWT  
- Order management (track orders placed and received)  
- Review and rating system  

---

## 🛠️ Tech Stack
**Frontend:** React.js, Redux/Context API, Tailwind CSS / Material UI, React Router  
**Backend:** AWS Lambda, API Gateway  
**Database:** DynamoDB (users, products, orders, reviews)  
**Storage:** Amazon S3 (product images)  
**Payments:** Stripe Connect  
**Authentication:** AWS Cognito  
**Notifications (optional):** AWS SES  
**Monitoring:** AWS CloudWatch  

---

## 🏗️ Architecture Overview
### Frontend (React)
- React + Redux / Context API for state management  
- React Router for navigation  
- Axios / Fetch for API calls  
- Tailwind CSS / Material UI for styling  
- Stripe Checkout UI for payments  
- Real-time interactions via WebSockets / AWS AppSync  

### Backend (AWS Serverless)
| Service | Role |
|---------|------|
| AWS Cognito | User authentication and session management |
| API Gateway | Routes HTTP requests to Lambda functions |
| AWS Lambda | Handles registration, product listing, order processing |
| DynamoDB | Stores users, products, orders, reviews |
| Amazon S3 | Stores product images/media |
| Stripe Connect | Handles payments, commissions, and seller payouts |
| CloudWatch | Logs and monitors Lambda/API activity |
| AWS SES (Optional) | Sends emails for orders/notifications |

---

## 🔑 Key Feature Breakdown
### 1️⃣ Unified User Authentication & Role Handling
- Single account supports buying and selling  
- Cognito manages authentication and MFA  

### 2️⃣ Product Listings by Users
- Users can list, update, or remove products  
- Product details in DynamoDB, images in S3  
- Browse via categories, search, and filters  

### 3️⃣ Stripe-Based Payment Flow
- Buyers pay through Stripe Checkout  
- Marketplace commission automatically deducted  
- Sellers receive payouts via Stripe  
- Lambda functions update orders on payment events  

### 4️⃣ Order Management
- Buyers track order status (pending, shipped, delivered)  
- Sellers manage incoming orders  
- Real-time updates via AppSync or WebSockets  
- Optional email notifications via SES  

### 5️⃣ Ratings & Reviews
- Buyers can leave reviews for purchased products  
- Reviews stored in DynamoDB and displayed on product/user profiles  

---

## 🖥️ Pages Overview
### General Pages
- **HomePage:** Browse products with search and filters  
- **ProductDetailsPage:** View product info, price, stock, seller info, reviews  

### Authentication Pages
- **LoginPage:** Sign in via AWS Cognito  
- **SignupPage:** Register new account  
- **DashboardPage:** Unified dashboard with “My Products”, “My Orders”, profile, and notifications  

### Buyer Pages
- **CartPage:** View cart items and checkout  
- **CheckoutPage:** Stripe Checkout integration  
- **OrdersPlacedPage:** View order history  
- **ReviewProductPage:** Leave ratings/comments  

### Seller Pages
- **CreateProductPage:** Form to list new products  
- **MyProductsPage:** View and manage listed products  
- **EditProductPage:** Update product info  
- **OrdersReceivedPage:** Manage incoming orders  

### Optional Pages
- **TransactionsPage:** View financial transactions  
- **NotificationsPage:** Alerts for orders and updates  

---

## 🚀 Advanced Features (Optional)
- AI Recommendations via AWS Personalize  
- Live Chat using AWS AppSync & DynamoDB Streams  
- Product Verification with AWS Rekognition  
- Fraud Detection using AWS Fraud Detector  

---

## 📈 Why This Project Stands Out
- Full AWS stack – cloud-native development experience  
- Serverless architecture – scalable and cost-efficient  
- Dual-role user logic – demonstrates complex business rules  
- Secure payment processing with Stripe Connect  
- Marketplace domain – real-world relevance  

---

## ⚙️ Installation & Setup
1. Clone the repository:  
```bash
git clone https://github.com/username/digital-marketplace.git
Navigate into the project folder

cd digital-marketplace


Install dependencies

npm install


Set up environment variables
Create a .env file in the root folder with the following:

REACT_APP_API_URL=your_api_url
COGNITO_USER_POOL_ID=your_user_pool_id
COGNITO_CLIENT_ID=your_client_id
STRIPE_PUBLIC_KEY=your_stripe_key


Run the application

npm start


Access the app
Open your browser and go to:

http://localhost:3000


## 🏃 Usage

Once the application is running locally, you can interact with it as follows:

1. **Sign Up / Log In**  
   - Create a new account or log in with an existing account using email/password or social login (if configured).  
   - Users can act as **buyers**, **sellers**, or both with a single account.

2. **Browse Products**  
   - Visit the **HomePage** to view available products.  
   - Use search, filters, and categories to find items of interest.  

3. **Buy Products**  
   - Add products to your **Cart**.  
   - Proceed to **Checkout** to complete the payment via **Stripe Checkout**.  
   - Track order status in **OrdersPlacedPage**.

4. **Sell Products**  
   - Use **CreateProductPage** to list new products.  
   - Manage your inventory on **MyProductsPage** and update details via **EditProductPage**.  
   - Monitor incoming orders on **OrdersReceivedPage**.

5. **Reviews & Ratings**  
   - After completing a purchase, leave a review on **ReviewProductPage** to provide feedback for sellers/products.

---

## 📄 License

This project is licensed under the **MIT License** – see the [LICENSE](LICENSE) file for details.  

---

## 📬 Contact

**Pranet Allu**  
- 📧 Email: [pranetallu@gmail.com](mailto:pranetallu@gmail.com)  
- 🔗 LinkedIn: [linkedin.com/in/pranetallu/](https://linkedin.com/in/pranetallu/)  
- 🐙 GitHub: [github.com/PRANETALLU](https://github.com/PRANETALLU)
