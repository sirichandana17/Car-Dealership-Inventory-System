# Car Dealership Inventory System

A full-stack inventory management system for a car dealership.

## Tech Stack
- **Backend:** Node.js + Express.js
- **Database:** MySQL
- **Auth:** JWT + bcrypt
- **Frontend:** React + Tailwind CSS _(coming soon)_
- **Testing:** Jest + Supertest

## Project Status
| Step | Feature | Status |
|------|---------|--------|
| 1 | Project foundation + MySQL schema | ✅ Done |
| 2 | User authentication (register, login, JWT, middleware) | ✅ Done |
| 3 | Vehicle inventory APIs | 🔜 Next |
| 4 | Frontend | 🔜 Pending |

## Folder Structure
```
car-dealership/
├── backend/
│   ├── src/
│   │   ├── config/        # DB connection + schema
│   │   ├── controllers/   # Route handlers
│   │   ├── middleware/     # JWT auth + admin guard
│   │   ├── models/        # DB queries
│   │   ├── routes/        # Express routers
│   │   ├── services/      # Business logic
│   │   ├── tests/         # Jest + Supertest
│   │   ├── app.js
│   │   └── server.js
│   ├── .env               # Local credentials (never commit)
│   ├── .env.example       # Template
│   ├── .env.test          # Test DB credentials
│   └── package.json
├── frontend/              # Coming soon
├── .gitignore
├── PROMPTS.md
└── README.md
```

## Setup

### 1. Database
```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS car_dealership;"
mysql -u root -p car_dealership < backend/src/config/schema.sql
```

### 2. Backend
```bash
cd backend
cp .env.example .env
# Fill in your credentials in .env
npm install
npm start
```
Server runs on `http://localhost:3000`

### 3. Run Tests
```bash
# Create test database first
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS car_dealership_test;"
mysql -u root -p car_dealership_test < backend/src/config/schema.sql

cd backend
npm test
```

## API Endpoints

### Auth
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login, returns JWT |
| GET | `/api/auth/me` | User | Get current user |

### Health
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Server health check |

## Environment Variables
See `.env.example` for all required variables.
