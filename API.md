# Finance Dashboard Backend - API Documentation

## 📋 Table of Contents

- [Base URL](#base-url)
- [Authentication](#authentication)
- [Authentication Endpoints](#authentication-endpoints)
- [User Management Endpoints](#user-management-endpoints)
- [Record Management Endpoints](#record-management-endpoints)
- [Dashboard Analytics Endpoints](#dashboard-analytics-endpoints)
- [Role Permissions](#role-permissions)

---

## Base URL

```
http://localhost:5000/api
```

---

## Authentication

Most endpoints require authentication. Include the JWT token in the request header:

```
Authorization: Bearer <your-jwt-token>
```

---

## Authentication Endpoints

### 1. Register User

**POST** `/api/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "viewer"
}
```

**Valid Roles:** `admin`, `analyst`, `viewer`

**Response (Success - 200):**
```json
{
  "message": "User registered",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "viewer"
  }
}
```

**Response (Error - 400):**
```json
{
  "message": "User already exists"
}
```

---

### 2. Login User

**POST** `/api/auth/login`

Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (Success - 200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "viewer"
  }
}
```

**Response (Error - 400):**
```json
{
  "message": "Invalid credentials"
}
```

**Response (Error - 403):**
```json
{
  "message": "Account is inactive. Contact admin."
}
```

---

### 3. Forgot Password

**POST** `/api/auth/forgot-password`

Generate and send OTP for password reset.

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response (Success - 200):**
```json
{
  "message": "OTP sent successfully"
}
```

**Response (Error - 404):**
```json
{
  "message": "User not found"
}
```

**Note:** The OTP is currently logged to the console for development purposes. In production, this should be sent via email.

---

### 4. Reset Password

**POST** `/api/auth/reset-password`

Reset user password using OTP.

**Request Body:**
```json
{
  "email": "john@example.com",
  "otp": "123456",
  "newPassword": "newpassword123"
}
```

**Response (Success - 200):**
```json
{
  "message": "Password reset successful"
}
```

**Response (Error - 400):**
```json
{
  "message": "Invalid or expired OTP"
}
```

**Note:** OTP expires after 5 minutes.

---

## User Management Endpoints

### 5. Get All Users

**GET** `/api/users/all`

Get all users with their status.

**Access:** Admin only

**Headers:**
```
Authorization: Bearer <token>
```

**Response (Success - 200):**
```json
[
  {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "viewer",
    "status": "active"
  },
  {
    "id": "user_id_2",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "role": "analyst",
    "status": "inactive"
  }
]
```

---

### 6. Toggle User Status

**PUT** `/api/users/:id/status`

Update user account status to active or inactive.

**Access:** Admin only

**Headers:**
```
Authorization: Bearer <token>
```

**Path Parameters:**
- `id`: User ID to update

**Request Body:**
```json
{
  "status": "inactive"
}
```

**Valid Status Values:** `active`, `inactive`

**Response (Success - 200):**
```json
{
  "message": "User is now inactive",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "viewer",
    "status": "inactive"
  }
}
```

**Response (Error - 400):**
```json
{
  "message": "Invalid status value"
}
```

**Response (Error - 404):**
```json
{
  "message": "User not found"
}
```

**Note:** Inactive users cannot login even with valid credentials.

---

## Record Management Endpoints

### 7. Create Record

**POST** `/api/records`

Create a new financial record.

**Access:** Admin only

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "amount": 5000,
  "type": "income",
  "category": "salary",
  "date": "2024-04-02",
  "note": "Monthly salary"
}
```

**Required Fields:** `amount`, `type`, `category`

**Valid Types:** `income`, `expense`

**Response (Success - 200):**
```json
{
  "message": "Record created",
  "record": {
    "id": "record_id",
    "amount": 5000,
    "type": "income",
    "category": "salary",
    "date": "2024-04-02T00:00:00.000Z",
    "note": "Monthly salary",
    "createdBy": "Admin Name"
  }
}
```

**Response (Error - 400):**
```json
{
  "message": "Required fields missing"
}
```

---

### 8. Get All Records

**GET** `/api/records`

Retrieve all financial records with optional filtering.

**Access:** Admin, Analyst, Viewer

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters (Optional):**
- `type`: Filter by type (`income` or `expense`)
- `category`: Filter by category
- `startDate`: Filter by start date (YYYY-MM-DD)
- `endDate`: Filter by end date (YYYY-MM-DD)
- `search`: Search in category or note fields (case-insensitive)

**Examples:**
```
GET /api/records?type=income
GET /api/records?category=salary
GET /api/records?type=expense&category=food
GET /api/records?startDate=2024-01-01&endDate=2024-12-31
GET /api/records?search=salary
```

**Response (Success - 200):**
```json
[
  {
    "id": "record_id",
    "amount": 5000,
    "type": "income",
    "category": "salary",
    "date": "2024-04-02T00:00:00.000Z",
    "note": "Monthly salary",
    "createdBy": "Admin Name"
  }
]
```

---

### 9. Update Record

**PUT** `/api/records/:id`

Update an existing financial record.

**Access:** Admin only

**Headers:**
```
Authorization: Bearer <token>
```

**Path Parameters:**
- `id`: Record ID to update

**Request Body:**
```json
{
  "amount": 6000,
  "note": "Updated monthly salary"
}
```

**Response (Success - 200):**
```json
{
  "message": "Record updated",
  "record": {
    "id": "record_id",
    "amount": 6000,
    "type": "income",
    "category": "salary",
    "date": "2024-04-02T00:00:00.000Z",
    "note": "Updated monthly salary",
    "createdBy": "Admin Name"
  }
}
```

**Response (Error - 404):**
```json
{
  "message": "Record not found"
}
```

---

### 10. Delete Record

**DELETE** `/api/records/:id`

Delete a financial record.

**Access:** Admin only

**Headers:**
```
Authorization: Bearer <token>
```

**Path Parameters:**
- `id`: Record ID to delete

**Response (Success - 200):**
```json
{
  "message": "Record deleted"
}
```

**Response (Error - 404):**
```json
{
  "message": "Record not found"
}
```

---

## Dashboard Analytics Endpoints

### 11. Get Total Income

**GET** `/api/dashboard/income`

Get total income from all records.

**Access:** Admin, Analyst, Viewer

**Headers:**
```
Authorization: Bearer <token>
```

**Response (Success - 200):**
```json
{
  "totalIncome": 50000
}
```

---

### 12. Get Total Expense

**GET** `/api/dashboard/expense`

Get total expense from all records.

**Access:** Admin, Analyst, Viewer

**Headers:**
```
Authorization: Bearer <token>
```

**Response (Success - 200):**
```json
{
  "totalExpense": 30000
}
```

---

### 13. Get Balance

**GET** `/api/dashboard/balance`

Get balance summary (income - expense).

**Access:** Admin, Analyst, Viewer

**Headers:**
```
Authorization: Bearer <token>
```

**Response (Success - 200):**
```json
{
  "totalIncome": 50000,
  "totalExpense": 30000,
  "balance": 20000
}
```

---

### 14. Get Category Breakdown

**GET** `/api/dashboard/category`

Get financial breakdown by category.

**Access:** Admin, Analyst

**Headers:**
```
Authorization: Bearer <token>
```

**Response (Success - 200):**
```json
[
  {
    "category": "salary",
    "total": 50000
  },
  {
    "category": "food",
    "total": 5000
  },
  {
    "category": "transport",
    "total": 3000
  }
]
```

---

### 15. Get Trends

**GET** `/api/dashboard/trends`

Get monthly financial trends.

**Access:** Admin, Analyst

**Headers:**
```
Authorization: Bearer <token>
```

**Response (Success - 200):**
```json
[
  {
    "year": 2024,
    "month": 1,
    "total": 45000
  },
  {
    "year": 2024,
    "month": 2,
    "total": 52000
  },
  {
    "year": 2024,
    "month": 3,
    "total": 48000
  }
]
```

---

### 16. Get Recent Activity

**GET** `/api/dashboard/recent`

Get the 5 most recent financial records.

**Access:** Admin, Analyst, Viewer

**Headers:**
```
Authorization: Bearer <token>
```

**Response (Success - 200):**
```json
[
  {
    "id": "record_id",
    "amount": 5000,
    "type": "income",
    "category": "salary",
    "date": "2024-04-02T00:00:00.000Z",
    "note": "Monthly salary",
    "createdBy": "Admin Name"
  }
]
```

---

## Role Permissions

| Endpoint | Admin | Analyst | Viewer |
|----------|-------|---------|--------|
| POST /api/auth/register | ✅ | ✅ | ✅ |
| POST /api/auth/login | ✅ | ✅ | ✅ |
| POST /api/auth/forgot-password | ✅ | ✅ | ✅ |
| POST /api/auth/reset-password | ✅ | ✅ | ✅ |
| GET /api/users/all | ✅ | ❌ | ❌ |
| PUT /api/users/:id/status | ✅ | ❌ | ❌ |
| POST /api/records | ✅ | ❌ | ❌ |
| GET /api/records | ✅ | ✅ | ✅ |
| PUT /api/records/:id | ✅ | ❌ | ❌ |
| DELETE /api/records/:id | ✅ | ❌ | ❌ |
| GET /api/dashboard/income | ✅ | ✅ | ✅ |
| GET /api/dashboard/expense | ✅ | ✅ | ✅ |
| GET /api/dashboard/balance | ✅ | ✅ | ✅ |
| GET /api/dashboard/category | ✅ | ✅ | ❌ |
| GET /api/dashboard/trends | ✅ | ✅ | ❌ |
| GET /api/dashboard/recent | ✅ | ✅ | ✅ |

---

## Testing Examples

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

**Get Records with Filters:**
```bash
curl -X GET "http://localhost:5000/api/records?type=income&category=salary" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Search Records:**
```bash
curl -X GET "http://localhost:5000/api/records?search=salary" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Date Range Filter:**
```bash
curl -X GET "http://localhost:5000/api/records?startDate=2024-01-01&endDate=2024-12-31" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```