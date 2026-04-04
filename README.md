# Finance Dashboard Backend

A RESTful backend API for managing personal finance data with role-based access control, built using Node.js, Express, and MongoDB.

## 📦 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcryptjs
- **Environment Variables:** dotenv

---

## 📋 Features

- User authentication with JWT tokens
- Role-based access control (Admin, Analyst, Viewer)
- Financial record management (income/expense tracking)
- Dashboard analytics and reporting
- Category breakdown and trend analysis
- Password reset with OTP
- User account activation/deactivation

---

## 🛠️ Installation Steps

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd financeDashboardBackend
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages:
- express
- mongoose
- bcryptjs
- jsonwebtoken
- dotenv

### Step 3: Environment Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:

```
MONGO_URI=mongodb://127.0.0.1:27017/finance_dashboard
JWT_SECRET=your_super_secret_jwt_key
```

**Environment Variables:**
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token generation (use a strong, random string)

### Step 4: Start MongoDB

Make sure MongoDB is running on your system:

**Windows:**
```bash
mongod
```

**Linux/Mac:**
```bash
sudo systemctl start mongod
```

### Step 5: Seed Database (Optional)

Populate the database with sample users and records for testing:

```bash
npm run seed
```

This will create:
- **3 Users:**
  - Admin: `admin@test.com` / `123456`
  - Analyst: `analyst@test.com` / `123456`
  - Viewer: `viewer@test.com` / `123456`
- **2 Sample Records:**
  - Income: 5000 (Salary)
  - Expense: 1000 (Food)

**Note:** This script clears existing data before inserting new records.

---

### Step 6: Run the Application

Start the development server:

```bash
npm start
```

The server will start on **http://localhost:5000**

You should see:
```
Server running on port 5000
```

---

## 🔐 Default Test Credentials

After running the seed script (`npm run seed`), you can use these test accounts:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@test.com | 123456 |
| Analyst | analyst@test.com | 123456 |
| Viewer | viewer@test.com | 123456 |

These accounts are pre-configured with appropriate permissions for testing all API endpoints.

---

## 📚 API Documentation

For complete API documentation including all endpoints, request/response examples, and role permissions, please refer to:

👉 **[API Documentation](API.md)**

### Quick Overview

**Base URL:** `http://localhost:5000/api`

**Authentication:** Include JWT token in header:
```
Authorization: Bearer <your-jwt-token>
```

### Available Endpoint Groups

- **Authentication** - Register, Login, Forgot Password, Reset Password
- **User Management** - Toggle user status (Admin only)
- **Records** - CRUD operations for financial records
- **Dashboard** - Analytics, trends, and reports

---

## 👥 User Roles & Permissions

| Role | Description |
|------|-------------|
| **Admin** | Full access to all features including record management, user management, and analytics |
| **Analyst** | Read-only access to records and full access to dashboard analytics |
| **Viewer** | Read-only access to records and basic dashboard metrics (income, expense, balance, recent activity) |

For detailed endpoint permissions table, see [API Documentation - Role Permissions](API.md#role-permissions).

---

## 🧪 Testing the API

### Using cURL

**Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123","role":"admin"}'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

**Create Record:**
```bash
curl -X POST http://localhost:5000/api/records \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"amount":1000,"type":"income","category":"salary"}'
```

For more testing examples including filters and search, see [API Documentation - Testing Examples](API.md#testing-examples).

### Using Postman

1. Import the API endpoints into Postman
2. Set up environment variable for base URL: `http://localhost:5000`
3. After login, save the token as an environment variable
4. Use `{{token}}` in Authorization headers

---

## 📝 Notes

- All timestamps are in ISO 8601 format
- Passwords are automatically hashed using bcrypt
- JWT tokens expire after 1 day
- An admin user is automatically created on first run
- The otp is sent in the console
- OTP for password reset expires after 5 minutes
- Inactive users cannot login even with correct credentials


