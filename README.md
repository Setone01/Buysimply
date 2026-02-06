# Buysimply Loan Management API

A NestJS RESTful API application for managing loans with role-based authentication.

## Features

- JWT-based authentication
- Role-based authorization (staff, admin, superadmin)
- Loan management endpoints
- Rate limiting
- Global error handling
- Request logging

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:
```env
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=1h
PORT=3000
```

3. Build the application:
```bash
npm run build
```

4. Run the application:
```bash
npm run start
```

Or run in development mode:
```bash
npm run start:dev
```

## API Endpoints

### Authentication

- `POST /auth/login` - Login user and get JWT token
- `POST /auth/logout` - Logout user

### Loans (Protected)

- `GET /loans` - Fetch all loans
- `GET /loans?status=pending|active` - Filter loans by status
- `GET /loans/:userEmail/get` - Fetch user's loans
- `GET /loans/expired` - Fetch expired loans
- `DELETE /loans/:loanId/delete` - Delete a loan (Super admin only)

## Roles and Permissions

- **Staff**: Can view all loans but cannot see applicant's totalLoan
- **Admin**: Can view all loans including applicant's totalLoan
- **Superadmin**: Has all admin privileges plus can delete loans

## Data Files

The application loads data from:
- `data/staff.json` - Contains staff credentials and roles
- `data/loans.json` - Contains loan records

## Example Usage

### Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "password123"}'
```

### Get Loans (with authentication)
```bash
curl -X GET http://localhost:3000/loans \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### Get Loans by Status
```bash
curl -X GET http://localhost:3000/loans?status=pending \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### Get User's Loans
```bash
curl -X GET http://localhost:3000/loans/user1@example.com/get \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### Delete Loan (Super Admin Only)
```bash
curl -X DELETE http://localhost:3000/loans/1/delete \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

## Error Handling

The API includes global error handling that returns consistent error responses with status codes, timestamps, and error messages.

## Rate Limiting

The API implements rate limiting to prevent abuse. By default, it allows 10 requests per minute per IP address.