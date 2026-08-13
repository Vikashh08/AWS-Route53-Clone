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

## 3. Live Demo
**Live Application:** [AWS Route 53 Clone (Vercel)](https://awsroute53clone.vercel.app/)
**Backend API Docs:** [Render Swagger UI](https://aws-route53-clone-4syu.onrender.com/docs)

> **Note for Evaluator:** The live demo backend is hosted on Render's free tier. Because the free tier uses an ephemeral filesystem, the SQLite database automatically resets itself after 15 minutes of inactivity. Please register a new account when testing the demo!

## 4. Architecture
The application follows a tiered clean architecture, strictly separating the frontend presentation layer from the backend API, allowing each to be scaled and maintained independently.

### Frontend
The frontend is built using Next.js 14 utilizing the App Router. It leverages React Server Components for improved initial load times, while falling back to Client Components where interactivity is required.
For styling, the application strictly adheres to the Cloudscape Design System (the official open-source design language used internally by AWS). State management is handled by TanStack React Query, providing aggressive caching and immediate cache invalidation upon data mutations (such as creating a DNS record), resulting in a zero-refresh user experience.

### Backend
The backend is a high-performance RESTful API constructed with FastAPI and Python. The codebase strictly isolates routing logic (`api/`), business services (`services/`), database repositories (`repositories/`), and data schemas (`schemas/`).
Data validation is handled by Pydantic V2, ensuring all payloads are rigorously validated via regular expressions before reaching the database layer.

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
The application relies on a relational database model managed by SQLAlchemy 2.0. By default, it operates on a lightweight SQLite database, tracked and executed via Alembic.

The schema is composed of three primary tables:

1.  **Users Table** (`users`)
    *   `id`: Primary key (UUID string)
    *   `email`: Unique string used for login
    *   `hashed_password`: Securely hashed password string using bcrypt
    *   `name`: Display name for the user profile

2.  **Hosted Zones Table** (`hosted_zones`)
    *   `id`: Primary key (UUID string)
    *   `name`: The domain name of the hosted zone (e.g., example.com)
    *   `caller_reference`: A unique string used to prevent duplicate creation requests
    *   `config_comment`: An optional string describing the purpose of the zone
    *   `resource_record_set_count`: An integer tracking the total number of records inside this zone
    *   `user_id`: Foreign key linking the zone to the user who created it

3.  **DNS Records Table** (`dns_records`)
    *   `id`: Primary key (UUID string)
    *   `hosted_zone_id`: Foreign key linking the record to its parent zone
    *   `name`: The subdomain or root domain (e.g., api.example.com)
    *   `type`: The standard DNS record type (A, AAAA, CNAME, TXT, MX, NS, PTR, SRV, CAA)
    *   `value`: The destination value or IP address. Multiline values are stored as a newline-separated string
    *   `ttl`: Time To Live (integer in seconds) indicating how long resolvers should cache the record
    *   `routing_policy`: The traffic routing configuration (defaults to Simple)

## 8. API Documentation
The FastAPI backend exposes a comprehensive set of RESTful endpoints. All interactive Swagger documentation is automatically generated at `http://localhost:8000/docs`.

### Authentication Endpoints
*   `POST /api/v1/auth/register`: Provisions a new account.
*   `POST /api/v1/auth/login`: Authenticates user and returns JWT token.
*   `GET /api/v1/auth/me`: Retrieves current authenticated user profile.
*   `POST /api/v1/auth/logout`: Invalidates session.

### Hosted Zone Endpoints
*   `GET /api/v1/hosted-zones`: Retrieves paginated list of all hosted zones owned by the user.
*   `POST /api/v1/hosted-zones`: Creates a new hosted zone and initializes it with default SOA/NS records.
*   `GET /api/v1/hosted-zones/{zone_id}`: Retrieves detailed configuration of a specific hosted zone.
*   `PATCH /api/v1/hosted-zones/{zone_id}`: Updates metadata (comment) for a hosted zone.
*   `DELETE /api/v1/hosted-zones/{zone_id}`: Permanently removes a hosted zone and cascades deletion to records.

### DNS Record Endpoints
*   `GET /api/v1/hosted-zones/{zone_id}/records`: Retrieves paginated list of DNS records for a specific zone.
*   `POST /api/v1/hosted-zones/{zone_id}/records`: Creates a new DNS record.
*   `GET /api/v1/hosted-zones/{zone_id}/records/{record_id}`: Retrieves details of a single DNS record.
*   `PATCH /api/v1/hosted-zones/{zone_id}/records/{record_id}`: Updates values or TTL of an existing DNS record.
*   `DELETE /api/v1/hosted-zones/{zone_id}/records/{record_id}`: Removes a DNS record from the zone.
*   `GET /api/v1/hosted-zones/{zone_id}/records/export`: Streams all records in the zone back to the client as JSON or standard BIND `.zone` text file.
*   `POST /api/v1/hosted-zones/{zone_id}/records/import`: Accepts multipart form upload of a standard BIND `.zone` file and populates the database.

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

## 13. Deployment
- **Frontend**: Can be deployed seamlessly to Vercel or AWS Amplify.
- **Backend**: Can be containerized via Docker and deployed to AWS App Runner, ECS, or Render.
- *Note:* Since this uses SQLite, the backend environment must support persistent disk storage (e.g., an attached EBS volume or Render Disk) to avoid losing data between deployments.

## 14. Bonus Features
- **Auto-provisioned Records**: Creates realistic `NS` and `SOA` records automatically when a Hosted Zone is created.
- **Dynamic Dashboard**: Fetches and aggregates real-time metrics across all hosted zones and records.
- **Strict Validation**: Validates IPv4/IPv6 addresses, CNAME formats, and TXT structures at the API boundary.

## 15. Limitations
- Does not modify actual DNS records.
- Mocked AWS services (Traffic Policies, Health Checks) are stubbed with "Coming Soon" pages.
- Advanced routing policies (Latency, Weighted) exist in the DB but lack complex UI workflows in this clone.

## 16. Future Improvements
- Add multi-user tenancy (currently scopes data strictly to the logged-in user, but lacks an admin view).
- Migrate to PostgreSQL for scalable production deployments.
