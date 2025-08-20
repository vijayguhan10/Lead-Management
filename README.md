# Lead Management System

A comprehensive lead management system built with React frontend and NestJS microservices.

## 🏗️ Architecture

- **Frontend**: React application (Port: 3000)
- **Backend**: 7 NestJS microservices

## 📦 Setup & Configuration

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Quick Start

1. **Clone and Install Dependencies**

   ```bash
   git clone <repository-url>
   cd Lead-Management
   npm install
   ```

2. **Start Frontend**

   ```bash
   cd client
   npm install
   npm start
   ```

3. **Start All Microservices**

   ```bash
   cd Microservices
   # Option 1: Use the convenience script
   npm install
   npm run start:all

   # Option 2: Start individually
   cd auth-service && npm install && npm run start:dev
   cd ../user-service && npm install && npm run start:dev
   # ... repeat for each service
   ```

## 🚀 Services & Ports

| Service                  | Port | Description                    |
| ------------------------ | ---- | ------------------------------ |
| **Frontend**             | 3000 | React client application       |
| **Auth Service**         | 3001 | Authentication & authorization |
| **User Service**         | 3002 | User management                |
| **Lead Service**         | 3003 | Lead operations & management   |
| **Call Service**         | 3004 | Call tracking & management     |
| **Export Service**       | 3005 | Data export functionality      |
| **Settings Service**     | 3006 | Application settings           |
| **Notification Service** | 3007 | Notifications & alerts         |

## 📁 Project Structure

```
Lead-Management/
├── client/                 # React frontend
│   ├── package.json
│   └── src/
├── Microservices/          # NestJS microservices
│   ├── package.json        # Convenience scripts (local only)
│   ├── auth-service/
│   ├── user-service/
│   ├── lead-service/
│   ├── call-service/
│   ├── export-service/
│   ├── settings-service/
│   └── notification-service/
└── package.json            # Root package.json
```

## 🔧 Development

- **Root package.json**: Contains workspace-level scripts and dependencies
- **Microservices/package.json**: Local development convenience scripts (not in git)
- Each service has its own `package.json` with service-specific dependencies

## 🌐 Access Points

- **Frontend**: http://localhost:3000
- **API Services**: http://localhost:3001-3007

All services run independently and can be started/stopped individually
checking ...
