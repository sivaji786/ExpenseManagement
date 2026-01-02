# Project Expenditure Management System - API

CodeIgniter 4.6.4 REST API backend for Project Expenditure Management System.

## Quick Start

### Prerequisites
- PHP 8.1 or higher
- MySQL 8.0
- Composer

### Installation

The API is already set up and ready to use!

### Start Development Server

```bash
php spark serve --host=0.0.0.0 --port=8080
```

API will be available at: `http://localhost:8080/api`

### Database Configuration

**Database Name:** `project_expenditure_db`  
**Host:** `localhost`  
**Username:** `root`  
**Password:** `root`  
**Port:** `3306`

Database is already created with all tables and seeded with mock data.

### Run Migrations (if needed)

```bash
php spark migrate
```

### Seed Database (if needed)

```bash
php spark db:seed UsersSeeder
php spark db:seed ProjectsSeeder
php spark db:seed ExpendituresSeeder
```

## API Endpoints

### Base URL
```
http://localhost:8080/api
```

### Authentication
- `POST /auth/login` - Login with username and password
- `POST /auth/logout` - Logout
- `GET /auth/me` - Get current user

### Users
- `GET /users` - List all users
- `GET /users/{id}` - Get user by ID
- `POST /users` - Create new user
- `PUT /users/{id}` - Update user
- `DELETE /users/{id}` - Delete user

### Projects
- `GET /projects` - List all projects
- `GET /projects/{id}` - Get project by ID
- `POST /projects` - Create new project
- `PUT /projects/{id}` - Update project
- `DELETE /projects/{id}` - Delete project
- `GET /projects/{id}/expenditures` - Get project expenditures

### Expenditures
- `GET /expenditures` - List all expenditures
- `GET /expenditures/{id}` - Get expenditure by ID
- `POST /expenditures` - Create new expenditure
- `PUT /expenditures/{id}` - Update expenditure
- `DELETE /expenditures/{id}` - Delete expenditure
- `PATCH /expenditures/{id}/status` - Update expenditure status

## Test Accounts

| Username | Password | Role |
|----------|----------|------|
| admin | admin123 | Admin |
| manager1 | manager123 | Manager |
| manager2 | manager123 | Manager |
| manager3 | manager123 | Manager |

## Example API Call

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Get Projects
```bash
curl -X GET http://localhost:8080/api/projects
```

## CORS Configuration

CORS is enabled for all origins (`Access-Control-Allow-Origin: *`).  
No CORS issues when calling from your React frontend!

## Response Format

All API responses follow this format:

### Success Response
```json
{
  "status": "success",
  "message": "Optional message",
  "data": { ... }
}
```

### Error Response
```json
{
  "status": "error",
  "message": "Error description",
  "errors": { ... }
}
```

## Project Structure

```
api/
├── app/
│   ├── Config/          # Configuration files
│   ├── Controllers/     # API controllers
│   ├── Models/          # Data models
│   ├── Filters/         # CORS filter
│   └── Database/        # Migrations & seeds
├── public/              # Public web root
├── .env                 # Environment config
└── spark                # CLI tool
```

## Useful Commands

```bash
# View routes
php spark routes

# Create migration
php spark make:migration MigrationName

# Create seeder
php spark make:seeder SeederName

# Create model
php spark make:model ModelName

# Create controller
php spark make:controller ControllerName
```

## Environment

Current environment: **development**  
Debug mode is enabled for easier troubleshooting.

## Support

For issues or questions, refer to the [CodeIgniter 4 Documentation](https://codeigniter.com/user_guide/).
