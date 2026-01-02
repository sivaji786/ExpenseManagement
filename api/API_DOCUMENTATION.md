# API Documentation - Project Expenditure Management System

## Base URL
```
http://localhost:8080/api
```

## Authentication Endpoints

### Login
**POST** `/auth/login`

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "id": "1",
    "username": "admin",
    "role": "admin",
    "name": "Super Admin",
    "email": "admin@company.com",
    "project_id": null,
    "created_at": "2025-12-16 14:27:10",
    "updated_at": "2025-12-16 14:27:10"
  }
}
```

**Error Response (401):**
```json
{
  "status": "error",
  "message": "Invalid username or password"
}
```

---

### Logout
**POST** `/auth/logout`

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Logout successful"
}
```

---

### Get Current User
**GET** `/auth/me?user_id={id}`

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "id": "1",
    "username": "admin",
    "role": "admin",
    "name": "Super Admin",
    "email": "admin@company.com"
  }
}
```

---

## Users Endpoints

### List All Users
**GET** `/users`

**Success Response (200):**
```json
{
  "status": "success",
  "data": [
    {
      "id": "1",
      "username": "admin",
      "role": "admin",
      "name": "Super Admin",
      "email": "admin@company.com",
      "project_id": null
    }
  ]
}
```

---

### Get User by ID
**GET** `/users/{id}`

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "id": "1",
    "username": "admin",
    "role": "admin",
    "name": "Super Admin",
    "email": "admin@company.com",
    "project_id": null
  }
}
```

**Error Response (404):**
```json
{
  "status": "error",
  "message": "User not found"
}
```

---

### Create User
**POST** `/users`

**Request Body:**
```json
{
  "username": "newuser",
  "password": "password123",
  "role": "manager",
  "name": "New User",
  "email": "newuser@company.com",
  "project_id": 1
}
```

**Success Response (201):**
```json
{
  "status": "success",
  "message": "User created successfully",
  "data": {
    "id": "5",
    "username": "newuser",
    "role": "manager",
    "name": "New User",
    "email": "newuser@company.com",
    "project_id": "1"
  }
}
```

---

### Update User
**PUT** `/users/{id}`

**Request Body:** (all fields optional)
```json
{
  "name": "Updated Name",
  "email": "updated@company.com",
  "project_id": 2
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "User updated successfully",
  "data": { ... }
}
```

---

### Delete User
**DELETE** `/users/{id}`

**Success Response (200):**
```json
{
  "status": "success",
  "message": "User deleted successfully"
}
```

---

## Projects Endpoints

### List All Projects
**GET** `/projects`

**Success Response (200):**
```json
{
  "status": "success",
  "data": [
    {
      "id": "1",
      "name": "Connaught Place Metro Hub",
      "manager_id": "2",
      "budget": "18500000.00",
      "total_expenditure": "13475000.00",
      "status": "active",
      "start_date": "2024-01-15",
      "description": "Underground metro interchange station",
      "created_at": "2025-12-16 14:27:11",
      "updated_at": "2025-12-16 14:27:11"
    }
  ]
}
```

---

### Get Project by ID
**GET** `/projects/{id}`

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "id": "1",
    "name": "Connaught Place Metro Hub",
    "manager_id": "2",
    "budget": "18500000.00",
    "total_expenditure": "13475000.00",
    "status": "active",
    "start_date": "2024-01-15",
    "description": "Underground metro interchange station"
  }
}
```

---

### Create Project
**POST** `/projects`

**Request Body:**
```json
{
  "name": "New Project",
  "manager_id": 2,
  "budget": 5000000,
  "total_expenditure": 0,
  "status": "active",
  "start_date": "2024-12-16",
  "description": "Project description"
}
```

**Success Response (201):**
```json
{
  "status": "success",
  "message": "Project created successfully",
  "data": { ... }
}
```

---

### Update Project
**PUT** `/projects/{id}`

**Request Body:** (all fields optional)
```json
{
  "name": "Updated Project Name",
  "budget": 6000000,
  "status": "on-hold"
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Project updated successfully",
  "data": { ... }
}
```

---

### Delete Project
**DELETE** `/projects/{id}`

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Project deleted successfully"
}
```

---

### Get Project Expenditures
**GET** `/projects/{id}/expenditures`

**Success Response (200):**
```json
{
  "status": "success",
  "data": [
    {
      "id": "1",
      "project_id": "1",
      "category": "Materials",
      "amount": "3200000.00",
      "description": "TMT steel bars and RCC concrete",
      "date": "2024-01-20",
      "created_by": "2",
      "status": "approved"
    }
  ]
}
```

---

## Expenditures Endpoints

### List All Expenditures
**GET** `/expenditures`

**Success Response (200):**
```json
{
  "status": "success",
  "data": [
    {
      "id": "1",
      "project_id": "1",
      "category": "Materials",
      "amount": "3200000.00",
      "description": "TMT steel bars and RCC concrete",
      "date": "2024-01-20",
      "created_by": "2",
      "status": "approved",
      "created_at": "2025-12-16 14:27:12",
      "updated_at": "2025-12-16 14:27:12"
    }
  ]
}
```

---

### Get Expenditure by ID
**GET** `/expenditures/{id}`

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "id": "1",
    "project_id": "1",
    "category": "Materials",
    "amount": "3200000.00",
    "description": "TMT steel bars",
    "date": "2024-01-20",
    "created_by": "2",
    "status": "approved"
  }
}
```

---

### Create Expenditure
**POST** `/expenditures`

**Request Body:**
```json
{
  "project_id": 1,
  "category": "Materials",
  "amount": 50000,
  "description": "New materials purchase",
  "date": "2024-12-16",
  "created_by": 2,
  "status": "pending"
}
```

**Success Response (201):**
```json
{
  "status": "success",
  "message": "Expenditure created successfully",
  "data": { ... }
}
```

---

### Update Expenditure
**PUT** `/expenditures/{id}`

**Request Body:** (all fields optional)
```json
{
  "amount": 55000,
  "description": "Updated description",
  "status": "approved"
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Expenditure updated successfully",
  "data": { ... }
}
```

---

### Delete Expenditure
**DELETE** `/expenditures/{id}`

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Expenditure deleted successfully"
}
```

---

### Update Expenditure Status
**PATCH** `/expenditures/{id}/status`

**Request Body:**
```json
{
  "status": "approved"
}
```

Valid status values: `pending`, `approved`, `rejected`

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Expenditure status updated successfully",
  "data": { ... }
}
```

**Error Response (400):**
```json
{
  "status": "error",
  "message": "Invalid status. Must be pending, approved, or rejected"
}
```

---

## Expenditure Categories

Available categories for expenditures:
- Materials
- Labor
- Equipment
- Subcontractor
- Permits
- Safety
- Consulting
- Environmental
- Utilities
- Landscaping
- Transportation
- Insurance
- Other

---

## Common HTTP Status Codes

- **200 OK** - Request successful
- **201 Created** - Resource created successfully
- **400 Bad Request** - Invalid request data
- **401 Unauthorized** - Authentication failed
- **404 Not Found** - Resource not found
- **500 Internal Server Error** - Server error

---

## CORS Headers

All responses include the following CORS headers:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Authorization
```

---

## Notes

1. All timestamps are in UTC format: `YYYY-MM-DD HH:MM:SS`
2. Passwords are automatically hashed when creating/updating users
3. Decimal values (budget, amount) are returned as strings to preserve precision
4. Foreign key constraints are enforced (e.g., manager_id must exist in users table)
5. Cascading deletes are enabled for expenditures when a project is deleted
