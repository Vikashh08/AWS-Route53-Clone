# AWS Route53 Clone

This repository contains a full-stack, production-ready clone of the AWS Route53 Management Console. It is designed to replicate the core experience of managing DNS records and Hosted Zones, utilizing a modern, scalable technology stack that ensures performance, security, and developer ergonomics. 

The architecture strictly separates the frontend presentation layer from the backend API, allowing each to be scaled and maintained independently.

## Demo

A live demonstration of this application is available at: [https://route53-clone.demo.example.com](https://route53-clone.demo.example.com)

Please note that this is a simulated environment. DNS configurations created here will not propagate to global DNS resolvers, but the application logic, authentication, and database operations are fully functional.

## Architecture Overview

The application follows a standard tiered architecture, divided into a client-side frontend and a server-side backend API.

### Frontend
The frontend is built using Next.js 14 utilizing the App Router. It leverages React Server Components for improved initial load times and search engine optimization, while falling back to Client Components where interactivity is required.

For styling and user interface components, the application strictly adheres to the Cloudscape Design System (the official open-source design language used internally by Amazon Web Services). This ensures the application is highly accessible, responsive, and visually identical to the authentic AWS console.

State management for server data is handled by TanStack React Query. This library provides aggressive caching, deduplication of network requests, and immediate cache invalidation upon data mutations (such as creating or deleting a DNS record), resulting in a zero-refresh user experience.

### Backend
The backend is a high-performance RESTful API constructed with FastAPI and Python. The codebase follows Clean Architecture principles, strictly isolating routing logic, business services, database repositories, and data schemas.

Data validation and serialization are handled by Pydantic V2, ensuring that all incoming payloads (such as complex multiline IP addresses for A records) are rigorously validated via regular expressions before they ever reach the database layer. 

Authentication is secured using JSON Web Tokens (JWT). The tokens are issued upon login and stored securely by the client to authorize subsequent requests.

## Database Schema

The application relies on a relational database model managed by SQLAlchemy 2.0. By default, it operates on a lightweight SQLite database for ease of development, but the Object-Relational Mapping (ORM) layer allows it to be seamlessly migrated to PostgreSQL or MySQL in a production environment. Database migrations and schema versioning are tracked and executed via Alembic.

The schema is composed of three primary tables:

1.  **Users Table**
    This table manages authentication and user identities.
    *   `id`: Primary key (UUID string)
    *   `email`: Unique string used for login
    *   `hashed_password`: Securely hashed password string using bcrypt
    *   `name`: Display name for the user profile

2.  **Hosted Zones Table**
    This table represents a collection of DNS records belonging to a single domain name.
    *   `id`: Primary key (UUID string)
    *   `name`: The domain name of the hosted zone (e.g., example.com)
    *   `caller_reference`: A unique string used to prevent duplicate creation requests
    *   `config_comment`: An optional string describing the purpose of the zone
    *   `resource_record_set_count`: An integer tracking the total number of records inside this zone
    *   `user_id`: Foreign key linking the zone to the user who created it

3.  **DNS Records Table**
    This table stores the individual DNS configurations associated with a specific hosted zone.
    *   `id`: Primary key (UUID string)
    *   `hosted_zone_id`: Foreign key linking the record to its parent zone
    *   `name`: The subdomain or root domain (e.g., api.example.com)
    *   `type`: The standard DNS record type (A, AAAA, CNAME, TXT, MX, NS, PTR, SRV, CAA)
    *   `value`: The destination value or IP address. Multiline values are stored as a newline-separated string
    *   `ttl`: Time To Live (integer in seconds) indicating how long resolvers should cache the record
    *   `routing_policy`: The traffic routing configuration (defaults to Simple)

## API Overview

The FastAPI backend exposes a comprehensive set of RESTful endpoints. All endpoints under the `/api/v1/hosted-zones` route require a valid JWT Bearer token in the authorization header.

### Authentication Endpoints
*   `POST /api/v1/auth/register`: Accepts user credentials, hashes the password, and provisions a new account.
*   `POST /api/v1/auth/login`: Authenticates user credentials and returns a JWT token.
*   `GET /api/v1/auth/me`: Retrieves the profile data of the currently authenticated user.
*   `POST /api/v1/auth/logout`: Invalidates the current session.

### Hosted Zone Endpoints
*   `GET /api/v1/hosted-zones`: Retrieves a paginated list of all hosted zones owned by the user. Supports searching by domain name.
*   `POST /api/v1/hosted-zones`: Creates a new hosted zone and initializes it with default SOA and NS records.
*   `GET /api/v1/hosted-zones/{zone_id}`: Retrieves the detailed configuration of a specific hosted zone.
*   `PATCH /api/v1/hosted-zones/{zone_id}`: Updates metadata for a specific hosted zone, such as its comment.
*   `DELETE /api/v1/hosted-zones/{zone_id}`: Permanently removes a hosted zone and cascades the deletion to all associated DNS records.

### DNS Record Endpoints
*   `GET /api/v1/hosted-zones/{zone_id}/records`: Retrieves a paginated list of DNS records for a specific zone. Supports filtering by record type and searching by record name.
*   `POST /api/v1/hosted-zones/{zone_id}/records`: Creates a new DNS record.
*   `GET /api/v1/hosted-zones/{zone_id}/records/{record_id}`: Retrieves the details of a single DNS record.
*   `PATCH /api/v1/hosted-zones/{zone_id}/records/{record_id}`: Updates the values or TTL of an existing DNS record.
*   `DELETE /api/v1/hosted-zones/{zone_id}/records/{record_id}`: Removes a DNS record from the zone.
*   `GET /api/v1/hosted-zones/{zone_id}/records/export`: Streams all records in the zone back to the client as either a raw JSON array or a standard BIND-formatted `.zone` text file.
*   `POST /api/v1/hosted-zones/{zone_id}/records/import`: Accepts a multipart form upload of a standard BIND `.zone` file, parses the text content, and populates the database with the parsed records.

## Setup Instructions

Follow these instructions to run the application locally for development.

### Prerequisites
*   Python 3.10 or higher
*   Node.js 18 or higher
*   NPM or Yarn package manager

### Backend Setup

1.  Navigate into the backend directory:
    ```bash
    cd backend
    ```

2.  Create and activate a virtual Python environment:
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows use: venv\Scripts\activate
    ```

3.  Install the required Python dependencies:
    ```bash
    pip install -r requirements.txt
    ```

4.  Configure the environment variables. Copy the example configuration file and adjust any keys if necessary:
    ```bash
    cp .env.example .env
    ```

5.  Apply the database migrations to generate the SQLite schema:
    ```bash
    alembic upgrade head
    ```

6.  Start the FastAPI development server:
    ```bash
    uvicorn app.main:app --reload --port 8000
    ```
    The API documentation (Swagger UI) will now be accessible at `http://localhost:8000/docs`.

### Frontend Setup

1.  Open a new terminal window and navigate into the frontend directory:
    ```bash
    cd frontend
    ```

2.  Install the Node.js dependencies:
    ```bash
    npm install
    ```

3.  Start the Next.js development server:
    ```bash
    npm run dev
    ```

4.  Open your web browser and navigate to `http://localhost:3000`. You will be redirected to the login screen where you can register a new account and begin managing your DNS configurations.
