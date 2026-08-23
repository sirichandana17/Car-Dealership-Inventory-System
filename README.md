# Car Dealership Inventory System

A full-stack inventory management system for a car dealership.

## Tech Stack
- **Backend:** Node.js + Express.js
- **Database:** MySQL
- **Auth:** JWT + bcrypt
- **Frontend:** React + Tailwind CSS + React Router + Axios
- **Testing:** Jest + Supertest

## Project Status
| Step | Feature | Status |
|------|---------|--------|
| 1 | Project foundation + MySQL schema | ✅ Done |
| 2 | User authentication (register, login, JWT, middleware) | ✅ Done |
| 3 | Vehicle inventory APIs + image support | ✅ Done |
| 4 | React frontend (all pages + components) | ✅ Done |
| 5 | Dark UI theme + seed data + strong validation | ✅ Done |

## Quick Start

### 1. Database Setup
```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS car_dealership;"
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS car_dealership_test;"
mysql -u root -p car_dealership < backend/src/config/schema.sql
mysql -u root -p car_dealership_test < backend/src/config/schema.sql
```

### 2. Backend
```bash
cd backend
cp .env.example .env        # fill in your credentials
npm install
node seed.js                # seeds admin + 12 vehicles
npm start                   # runs on http://localhost:3000
```

### 3. Frontend
Open a second terminal:
```bash
cd frontend
npm install
npm start                   # runs on http://localhost:3001
```

### 4. Run Tests
```bash
cd backend
npm test
```

## Ports
| Service | Port |
|---------|------|
| Backend API | 3000 |
| Frontend React | 3001 |

> If you see `EADDRINUSE`, run:
> ```powershell
> netstat -aon | findstr :3000
> taskkill /PID <pid> /F
> ```

## Demo Credentials

### Admin
| Field | Value |
|-------|-------|
| Email | `admin@autodealer.com` |
| Password | `Admin@1234` |

### Register a normal user
Visit `http://localhost:3001/register`

## API Endpoints

### Auth
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login, returns JWT |
| GET | `/api/auth/me` | User | Get current user |

### Vehicles
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/vehicles` | Admin | Add a new vehicle |
| GET | `/api/vehicles` | Public | Get all vehicles |
| GET | `/api/vehicles/search` | Public | Search/filter vehicles |
| PUT | `/api/vehicles/:id` | Admin | Update vehicle |
| DELETE | `/api/vehicles/:id` | Admin | Delete vehicle |
| POST | `/api/vehicles/:id/purchase` | User | Purchase vehicle (qty -1) |
| POST | `/api/vehicles/:id/restock` | Admin | Restock vehicle |

## Frontend Pages
| Page | Route | Access |
|------|-------|--------|
| Login | `/login` | Public |
| Register | `/register` | Public |
| Vehicle Showroom | `/dashboard` | Logged-in users |
| Admin Dashboard | `/admin` | ADMIN role only |

## Password Requirements
- Minimum 8 characters
- At least one uppercase letter (A-Z)
- At least one lowercase letter (a-z)
- At least one number (0-9)
- At least one special character (!@#$%...)
