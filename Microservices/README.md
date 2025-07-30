# Lead Management Microservices

This repository contains 7 microservices built with NestJS for the Lead Management application.

## Services Overview

| Service              | Port | Description                      | Endpoint              |
| -------------------- | ---- | -------------------------------- | --------------------- |
| Auth Service         | 3001 | Authentication and authorization | http://localhost:3001 |
| User Service         | 3002 | User management                  | http://localhost:3002 |
| Lead Service         | 3003 | Lead management and tracking     | http://localhost:3003 |
| Call Service         | 3004 | Call logging and management      | http://localhost:3004 |
| Export Service       | 3005 | Data export functionality        | http://localhost:3005 |
| Settings Service     | 3006 | Application settings             | http://localhost:3006 |
| Notification Service | 3007 | Notifications and alerts         | http://localhost:3007 |

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- NestJS CLI (optional, for development)

## Installation

### Install dependencies for all services

```bash
# Navigate to each service directory and install dependencies
cd auth-service && npm install && cd ..
cd user-service && npm install && cd ..
cd lead-service && npm install && cd ..
cd call-service && npm install && cd ..
cd export-service && npm install && cd ..
cd settings-service && npm install && cd ..
cd notification-service && npm install && cd ..
```

### Or use this PowerShell script to install all at once:

```powershell
$services = @("auth-service", "user-service", "lead-service", "call-service", "export-service", "settings-service", "notification-service")
foreach ($service in $services) {
    Write-Host "Installing dependencies for $service..."
    Set-Location $service
    npm install
    Set-Location ..
}
Write-Host "All dependencies installed!"
```

## Running the Services

### Individual Services

```bash
# Auth Service (Port 3001)
cd auth-service
npm run start:dev

# User Service (Port 3002)
cd user-service
npm run start:dev

# Lead Service (Port 3003)
cd lead-service
npm run start:dev

# Call Service (Port 3004)
cd call-service
npm run start:dev

# Export Service (Port 3005)
cd export-service
npm run start:dev

# Settings Service (Port 3006)
cd settings-service
npm run start:dev

# Notification Service (Port 3007)
cd notification-service
npm run start:dev
```

### Run All Services (PowerShell)

Create a `start-all-services.ps1` file:

```powershell
$services = @(
    @{name="auth-service"; port=3001},
    @{name="user-service"; port=3002},
    @{name="lead-service"; port=3003},
    @{name="call-service"; port=3004},
    @{name="export-service"; port=3005},
    @{name="settings-service"; port=3006},
    @{name="notification-service"; port=3007}
)

foreach ($service in $services) {
    Write-Host "Starting $($service.name) on port $($service.port)..."
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$($service.name)'; npm run start:dev"
}
```

## API Endpoints

Each service provides the following default endpoints:

### Auth Service (http://localhost:3001)

- `GET /` - Service health check
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/refresh` - Token refresh

### User Service (http://localhost:3002)

- `GET /` - Service health check
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `POST /users` - Create new user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Lead Service (http://localhost:3003)

- `GET /` - Service health check
- `GET /leads` - Get all leads
- `GET /leads/:id` - Get lead by ID
- `POST /leads` - Create new lead
- `PUT /leads/:id` - Update lead
- `DELETE /leads/:id` - Delete lead

### Call Service (http://localhost:3004)

- `GET /` - Service health check
- `GET /calls` - Get all calls
- `GET /calls/:id` - Get call by ID
- `POST /calls` - Log new call
- `PUT /calls/:id` - Update call
- `DELETE /calls/:id` - Delete call

### Export Service (http://localhost:3005)

- `GET /` - Service health check
- `GET /export/leads` - Export leads data
- `GET /export/calls` - Export calls data
- `GET /export/users` - Export users data

### Settings Service (http://localhost:3006)

- `GET /` - Service health check
- `GET /settings` - Get all settings
- `GET /settings/:key` - Get setting by key
- `POST /settings` - Create new setting
- `PUT /settings/:key` - Update setting

### Notification Service (http://localhost:3007)

- `GET /` - Service health check
- `GET /notifications` - Get all notifications
- `POST /notifications` - Send notification
- `PUT /notifications/:id/read` - Mark as read

## Development

### Adding New Endpoints

Each service follows standard NestJS structure:

```
src/
├── app.controller.ts    # Main controller
├── app.module.ts       # Main module
├── app.service.ts      # Main service
└── main.ts            # Application entry point
```

### Testing

```bash
# Run tests for individual service
cd [service-name]
npm run test

# Run e2e tests
npm run test:e2e
```

### Building for Production

```bash
# Build individual service
cd [service-name]
npm run build

# Build all services
$services = @("auth-service", "user-service", "lead-service", "call-service", "export-service", "settings-service", "notification-service")
foreach ($service in $services) {
    Set-Location $service
    npm run build
    Set-Location ..
}
```

## Architecture

This microservices architecture provides:

- **Separation of Concerns**: Each service handles a specific domain
- **Scalability**: Services can be scaled independently
- **Technology Flexibility**: Each service can use different technologies if needed
- **Fault Isolation**: Failure in one service doesn't affect others
- **Independent Deployment**: Services can be deployed separately

## Environment Variables

Each service can be configured using environment variables:

```bash
# Common variables for all services
PORT=3001              # Service port
NODE_ENV=development   # Environment
DB_HOST=localhost      # Database host
DB_PORT=5432          # Database port
DB_NAME=lead_management # Database name
DB_USER=username       # Database user
DB_PASSWORD=password   # Database password

# Auth Service specific
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1h

# Notification Service specific
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email
SMTP_PASS=your-password
```

## Next Steps

1. **Database Integration**: Add database connections (PostgreSQL, MongoDB, etc.)
2. **Authentication**: Implement JWT authentication across services
3. **API Gateway**: Set up an API gateway for routing requests
4. **Service Discovery**: Implement service discovery mechanism
5. **Message Queue**: Add inter-service communication using message queues
6. **Monitoring**: Add logging, metrics, and health checks
7. **Docker**: Containerize each service
8. **CI/CD**: Set up deployment pipelines

## Useful Commands

```bash
# Check all running services
netstat -ano | findstr "300[1-7]"

# Stop all Node.js processes (if needed)
taskkill /f /im node.exe

# Install NestJS CLI globally
npm install -g @nestjs/cli

# Generate new resource in a service
nest generate resource [resource-name]
```
