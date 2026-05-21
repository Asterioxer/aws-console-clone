# AWSConsole

A custom AWS management console built with Next.js 14, Express, and LocalStack. It provides a standalone, free environment to manage mocked AWS resources using the real AWS SDK v3.

## Features
- **Standalone Mode**: Uses LocalStack to mock AWS services locally. No real AWS credentials or money required.
- **Full-stack**: Next.js 14 App Router (Frontend) + Express (Backend).
- **Authentication**: JWT-based auth with a SQLite database.
- **Beautiful UI**: Built with Tailwind CSS and shadcn/ui.
- **Services Supported**: EC2 (Start, Stop, Reboot, List), S3 (List Buckets, List Objects), IAM (Users, Roles), and Billing (Cost Explorer, mocked).

## Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local development outside Docker)

## Getting Started

1. **Start the application with Docker Compose**
   ```bash
   docker-compose up -d --build
   ```
   This will spin up three containers:
   - `frontend` (Next.js) on http://localhost:3000
   - `backend` (Express) on http://localhost:4000
   - `localstack` on http://localhost:4566

2. **Seed LocalStack with Mock Data**
   Since LocalStack starts empty, run the seed script to create dummy EC2 instances, S3 buckets, and IAM roles:
   ```bash
   cd backend
   npm install
   npm run seed
   ```
   *(Note: You can add `"seed": "node seed.js"` to your `backend/package.json` scripts)*

3. **Access the Application**
   - Open [http://localhost:3000](http://localhost:3000)
   - **Register an account**: The first user created will automatically be assigned the `admin` role. Alternatively, since there's no UI for registration, you can use the API directly or add a register page. Wait, a register API route exists at `POST http://localhost:4000/api/auth/register`. 
   
   To register your first user, run:
   ```bash
   curl -X POST http://localhost:4000/api/auth/register -H "Content-Type: application/json" -d '{"username":"admin", "password":"password123"}'
   ```
   
   Then login at [http://localhost:3000](http://localhost:3000) with `admin` / `password123`.

## Architecture
- **Frontend (`/frontend`)**: Next.js app running on port 3000. Uses Server Actions and API route proxies to avoid CORS and securely handle `httpOnly` JWT cookies.
- **Backend (`/backend`)**: Express server running on port 4000. Connects to `better-sqlite3` for user management and uses AWS SDK v3 pointing to LocalStack's endpoint.
- **LocalStack**: Emulates AWS cloud locally on port 4566.
