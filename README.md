# AWS Route 53 Clone

A full-stack, production-ready clone of the AWS Route 53 Console UI, built with Next.js (App Router), FastAPI, and SQLite. This project simulates the real Route 53 experience, allowing users to manage Hosted Zones and DNS Records in a visually authentic environment using AWS Cloudscape Design.

---

## 1. Project Overview
This application is a faithful recreation of the AWS Route 53 management console. It allows users to authenticate, create hosted zones (both public and private), and manage DNS records with an interface that closely mirrors the original AWS Cloudscape visual language. It does not actually modify DNS records on the public internet, but stores them accurately in a local SQLite database using industry-standard validation.

## 2. Features
- **Authentic AWS UI**: Built with the official `@cloudscape-design/components` library for a 1:1 visual match.
- **Hosted Zone Lifecycle**: Create, Read, Update, Delete (CRUD) public and private hosted zones.
- **DNS Record Management**: CRUD for DNS records with dynamic validation (A, AAAA, CNAME, MX, TXT, NS, PTR, SRV, CAA).
- **System Records**: Automatically provisions default `NS` and `SOA` records upon zone creation.
- **Search & Filtering**: Server-side pagination and search for both hosted zones and DNS records.
- **Authentication**: Fully functional session-based authentication flow (mocked user database).
- **Global Notifications**: AWS-style Flashbar for success/error operational feedback.

## 3. Screenshots
> *(Screenshots can be added here)*

## 4. Architecture
The application strictly enforces separation of concerns, ensuring the frontend never directly accesses the database, and the backend routes delegate logic to dedicated Services and Repositories.

```text
                    ┌──────────────┐
                    │   Browser    │
                    └──────┬───────┘
                           │
                           ▼ HTTPS / REST
                 ┌──────────────────┐
                 │ Next.js Frontend │
                 │ (TypeScript)     │
                 └────────┬─────────┘
                          │ REST API
                          ▼
                 ┌──────────────────┐
                 │ FastAPI Backend  │
                 ├──────────────────┤
                 │ API Routers      │
                 │ Services         │
                 │ Repositories     │
                 └────────┬─────────┘
                          │ SQLAlchemy
                          ▼
                 ┌──────────────────┐
                 │ SQLite           │
                 └──────────────────┘
```

## 5. Tech Stack
- **Frontend**: Next.js 14 (App Router), React, TypeScript, AWS Cloudscape Design, SWR.
- **Backend**: Python 3, FastAPI, Pydantic, SQLAlchemy, Alembic (Migrations), bcrypt.
- **Database**: SQLite.

## 6. Project Structure
The repository is split into frontend and backend packages:

```text
route53-clone/
├── frontend/
│   ├── src/
│   │   ├── app/            # Next.js App Router pages
│   │   ├── components/     # Reusable Cloudscape components
│   │   ├── hooks/          # Data fetching (SWR) hooks
│   │   ├── contexts/       # React Contexts (Auth, Notifications)
│   │   └── lib/            # Axios API client
│   └── package.json
│
├── backend/
│   ├── app/
│   │   ├── api/v1/         # FastAPI route handlers
│   │   ├── core/           # Config, logging, exceptions
│   │   ├── db/             # Database connection setup
│   │   ├── models/         # SQLAlchemy models
│   │   ├── schemas/        # Pydantic validation schemas
│   │   ├── services/       # Business logic layer
│   │   └── repositories/   # Data access layer
│   ├── alembic/            # Database migrations
│   └── requirements.txt
```

## 7. Database Schema
The database uses SQLAlchemy with Alembic for migrations.
- `users`: id, email, password_hash, created_at, updated_at
- `sessions`: id, user_id, token, expires_at
- `hosted_zones`: id, name, zone_type, comment, is_private, user_id, created_at, updated_at
- `dns_records`: id, hosted_zone_id, name, type, ttl, routing_policy, value, created_at, updated_at

## 8. API Documentation
FastAPI automatically generates interactive Swagger documentation.
When the backend is running, visit: `http://localhost:8000/docs` to test:
- `POST /api/v1/auth/login`
- `GET /api/v1/hosted-zones`
- `POST /api/v1/hosted-zones/{zone_id}/records`
- *(and all other endpoints)*

## 9. Authentication
The application uses cookie-based session authentication.
- Passwords are securely hashed using `bcrypt` (never stored in plaintext).
- The `AuthService` handles credential verification and issues session tokens.
- Next.js uses an `AuthContext` to protect routes and redirect unauthenticated users to `/login`.

## 10. Local Setup
1. **Clone the repository**
2. **Setup Backend**:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   alembic upgrade head
   uvicorn app.main:app --reload --port 8000
   ```
3. **Setup Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## 11. Environment Variables
Templates are provided in `.env.example`.
- **Backend**: `DATABASE_URL`, `SECRET_KEY`, `CORS_ORIGINS`
- **Frontend**: `NEXT_PUBLIC_API_URL`

## 12. Development
- The frontend runs on `http://localhost:3000`
- The backend runs on `http://localhost:8000`
- API calls from the frontend use the pre-configured Axios client in `frontend/src/lib/api.ts` which automatically attaches credentials.

## 13. Testing
- The backend architecture (Router -> Service -> Repository) makes it trivial to unit test business logic by mocking repositories.
- *(Test suites can be added using `pytest` for backend and `jest` for frontend).*

## 14. Deployment
- **Frontend**: Can be deployed seamlessly to Vercel or AWS Amplify.
- **Backend**: Can be containerized via Docker and deployed to AWS App Runner, ECS, or Render.
- *Note:* Since this uses SQLite, the backend environment must support persistent disk storage (e.g., an attached EBS volume or Render Disk) to avoid losing data between deployments.

## 15. Bonus Features
- **Auto-provisioned Records**: Creates realistic `NS` and `SOA` records automatically when a Hosted Zone is created.
- **Dynamic Dashboard**: Fetches and aggregates real-time metrics across all hosted zones and records.
- **Strict Validation**: Validates IPv4/IPv6 addresses, CNAME formats, and TXT structures at the API boundary.

## 16. Limitations
- Does not modify actual DNS records.
- Mocked AWS services (Traffic Policies, Health Checks) are stubbed with "Coming Soon" pages.
- Advanced routing policies (Latency, Weighted) exist in the DB but lack complex UI workflows in this clone.

## 17. Future Improvements
- Add `pytest` test coverage for the Service layer.
- Add multi-user tenancy (currently scopes data strictly to the logged-in user, but lacks an admin view).
- Migrate to PostgreSQL for scalable production deployments.
