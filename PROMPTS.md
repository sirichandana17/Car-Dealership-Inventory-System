# Prompts Log

## Step 1 — Foundation & Database
Set up project structure, Express server, MySQL connection pool, and schema (`users`, `vehicles` tables).

## Step 2 — User Authentication
Implemented register + login with bcrypt + JWT. Added `authenticate` and `requireAdmin` middleware. TDD with 20 Jest/Supertest tests — all passing.

## Step 3 — Vehicle & Inventory APIs
Full CRUD for vehicles + purchase/restock endpoints. Added `image_url` column. TDD with 33 Jest/Supertest tests — 53 total passing.

## Step 4 — React Frontend
Built full React frontend with Tailwind CSS dark theme, React Router, and Axios.
- Pages: Login, Register, Dashboard, Admin Dashboard
- Components: Navbar, VehicleCard, VehicleForm, AdminVehicleRow, SearchFilters, ProtectedRoute, AdminRoute, Loading, Notification
- JWT stored in localStorage, sent via Axios interceptor
- Vehicle images via `image_url` from DB
- Admin credentials shown on login page

## Step 5 — UI Theme + Seed Data
- Overhauled UI to dark carbon/chrome theme (zinc + red accent)
- Added `image_url` to vehicles table and backend
- Seeded 12 premium vehicles with Unsplash images
- Seeded admin account: `admin@autodealer.com` / `Admin@1234`
- Strong password validation (uppercase, lowercase, number, special char)
- Strict email regex on both frontend and backend

## Step 6 — Final Review & Documentation

- Finalized the project with Codex assistance through code review, debugging, testing, security checks, and documentation updates.

- Verified backend tests, frontend functionality, authentication, inventory, purchase flow, and overall project readiness.