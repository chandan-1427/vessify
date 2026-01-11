# Vessify TX - AI-Powered Transaction Extraction

Convert raw bank SMS and financial statements into structured data instantly. Secure, multi-currency, and built for modern teams.

> **Status**: Development | **Version**: 0.1.0

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Project Structure](#-project-structure)
- [Tech Stack](#-tech-stack)
- [Architecture & Workflows](#-architecture--workflows)
- [Security Measures](#-security-measures)
- [Installation Guide](#-installation-guide)
- [Usage Guide](#-usage-guide)
- [Development Workflow](#-development-workflow)
- [Testing](#-testing)
- [Deployment](#-deployment)

---

## 🎯 Project Overview

Vessify TX is a full-stack SaaS application designed to extract and structure financial transaction data from unstructured sources like bank SMS messages and financial statements. The platform provides:

- **AI-Powered Extraction**: Intelligent parsing of raw financial data
- **Multi-Tenancy**: Organization-based access control with role management
- **Secure Authentication**: JWT-based session management with rate limiting
- **Transaction Management**: Centralized transaction tracking and organization
- **Real-Time Updates**: Live transaction extraction and processing

---

## 📁 Project Structure

### Root Directory Layout

```
as-test-2/
├── backend/                 # Node.js API server
│   ├── src/
│   ├── prisma/              # Database schema & migrations
│   ├── generated/           # Prisma client generation
│   ├── coverage/            # Jest test coverage reports
│   └── package.json         # Backend dependencies
│
├── frontend/                # Next.js web application
│   ├── app/                 # App router & pages
│   ├── components/          # Reusable React components
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utilities & helpers
│   ├── public/              # Static assets
│   └── package.json         # Frontend dependencies
│
└── README.md               # This file
```

### Backend Directory Structure

```
backend/
├── src/
│   ├── index.ts            # Express/Hono server entry point
│   ├── lib/
│   │   ├── auth.ts         # Better-Auth configuration
│   │   └── prisma.ts       # Prisma client instance
│   ├── middleware/
│   │   ├── session.ts      # Session validation middleware
│   │   └── rateLimit.ts    # Rate limiting middleware
│   ├── routes/
│   │   ├── auth.routes.ts  # Authentication endpoints
│   │   └── transactions.routes.ts  # Transaction endpoints
│   ├── services/
│   │   ├── auth.service.ts # Authentication business logic
│   │   └── transaction.service.ts  # Transaction operations
│   ├── types/
│   │   ├── auth.types.ts   # Auth type definitions
│   │   ├── transaction.types.ts
│   │   └── transaction.schema.ts  # Zod schemas
│   └── tests/
│       ├── mocks/          # Mock utilities
│       ├── setup/          # Test setup & helpers
│       └── test-suites/    # Test files
│
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── migrations/         # Database migrations
│
├── generated/              # Auto-generated Prisma client
├── jest.config.ts          # Jest testing configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies & scripts
```

### Frontend Directory Structure

```
frontend/
├── app/
│   ├── layout.tsx          # Root layout wrapper
│   ├── page.tsx            # Home page
│   ├── (auth)/             # Auth route group
│   │   ├── login/
│   │   └── register/
│   ├── (common)/           # Public routes
│   │   └── demo/
│   ├── (protected)/        # Protected routes
│   │   └── dashboard/
│   └── api/
│       └── auth/[...nextauth]/  # NextAuth API route
│
├── components/
│   ├── auth/
│   │   └── logout-button.tsx
│   └── ui/                 # Shadcn UI components
│       ├── alert.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       └── ... (10+ reusable components)
│
├── hooks/
│   └── useRegister.ts      # Custom registration hook
│
├── lib/
│   ├── auth.ts             # NextAuth configuration
│   ├── fetcher.ts          # API request helper
│   ├── utils.ts            # Utility functions
│   └── api/
│       └── auth.ts         # Auth API calls
│
├── public/                 # Static assets
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies & scripts
```

---

## 🛠 Tech Stack

### Backend

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Hono** | ^4.11.3 | Ultra-fast web framework |
| **Node.js** | ^25.0.3 | JavaScript runtime |
| **TypeScript** | ^5.9.3 | Type safety |
| **Prisma** | ^7.2.0 | ORM & database management |
| **PostgreSQL** | ^8.16.3 | Relational database |
| **Better-Auth** | ^1.4.10 | Authentication & authorization |
| **Jest** | ^30.2.0 | Unit & integration testing |
| **Supertest** | ^7.2.2 | HTTP testing library |

**Use Cases**:
- **Hono**: Lightweight, edge-ready HTTP server for high performance
- **Prisma**: Type-safe database access with auto-migrations
- **PostgreSQL**: Reliable relational database for transactions & users
- **Better-Auth**: Secure JWT session management with rate limiting
- **Jest**: Comprehensive test coverage for services & routes

### Frontend

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Next.js** | ^15.5.9 | React framework with SSR |
| **React** | ^18.3.1 | UI library |
| **TypeScript** | ^5 | Type safety |
| **NextAuth.js** | ^4.24.13 | Authentication client |
| **Tailwind CSS** | ^4 | Utility-first CSS |
| **Radix UI** | ^2.x | Accessible component library |
| **Lucide React** | ^0.562.0 | Icon library |
| **Framer Motion** | ^12.25.0 | Animation library |

**Use Cases**:
- **Next.js**: Server-side rendering, API routes, optimized performance
- **Tailwind CSS**: Rapid UI development with pre-built utilities
- **Radix UI**: Accessible, headless components (dropdown, tabs, etc.)
- **Framer Motion**: Smooth animations for UX enhancement
- **NextAuth.js**: Client-side session management & auth flows

---

## 🏗 Architecture & Workflows

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Next.js)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Auth Pages  │  │  Dashboard   │  │  Components  │     │
│  │ (Login/Reg)  │  │ (Transactions)│  │  (Reusable)  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│         │                  │                  │              │
│         └──────────────────┼──────────────────┘              │
│                            │                                 │
│         NextAuth.js Session Management                       │
│                            │                                 │
└────────────────────────────┼─────────────────────────────────┘
                             │ HTTPS/CORS
┌────────────────────────────┼─────────────────────────────────┐
│                     Backend (Hono)                           │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              API Routes (Port 3000)                  │  │
│  │  ┌──────────────────┐  ┌──────────────────────────┐  │  │
│  │  │  /api/auth/*     │  │  /api/transactions/*    │  │  │
│  │  │  - register      │  │  - extract              │  │  │
│  │  │  - login         │  │  - list                 │  │  │
│  │  │  - logout        │  │  - update               │  │  │
│  │  └──────────────────┘  └──────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
│         │                  │                  │             │
│  ┌──────┴──────────────────┴──────────────────┴──────┐    │
│  │         Middleware Layer                         │    │
│  │  - CORS (origin validation)                      │    │
│  │  - Session Middleware (JWT validation)          │    │
│  │  - Rate Limiting (brute-force protection)       │    │
│  │  - Logging                                       │    │
│  └──────────────────────────────────────────────────┘    │
│         │                  │                  │             │
│  ┌──────┴──────────────────┴──────────────────┴──────┐    │
│  │         Services Layer                           │    │
│  │  - AuthService (JWT tokens, password hashing)   │    │
│  │  - TransactionService (CRUD operations)         │    │
│  └──────────────────────────────────────────────────┘    │
│         │                                                  │
└─────────┼──────────────────────────────────────────────────┘
          │ SQL Queries
┌─────────┴──────────────────────────────────────────────────┐
│         Database Layer (PostgreSQL)                        │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  Tables:                                             │ │
│  │  - user (accounts)                                   │ │
│  │  - session (JWT sessions)                            │ │
│  │  - organization (multi-tenancy)                      │ │
│  │  - member (org membership & roles)                   │ │
│  │  - transaction (extracted data)                      │ │
│  │  - account (OAuth providers)                         │ │
│  └──────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────┘
```

### Authentication Workflow

```
1. USER REGISTRATION
   ├─ Frontend: User submits email/password
   ├─ Backend: Validate credentials (Zod schema)
   ├─ Backend: Hash password + Create user in DB
   ├─ Backend: Generate JWT token + Set secure cookie
   └─ Frontend: Redirect to dashboard

2. USER LOGIN
   ├─ Frontend: User submits email/password
   ├─ Backend: Verify credentials against DB
   ├─ Backend: Rate limit check (max 5 attempts/15 min)
   ├─ Backend: Generate JWT token + Set secure cookie
   └─ Frontend: Store session + Redirect

3. SESSION VALIDATION (Protected Routes)
   ├─ Frontend: Include credentials in request
   ├─ Backend: Extract JWT from cookie
   ├─ Backend: Verify signature + Expiry
   ├─ Backend: Load user session + Organization context
   ├─ Backend: Check multi-tenancy membership
   └─ Backend: Grant/Deny access

4. LOGOUT
   ├─ Frontend: Clear NextAuth session
   ├─ Backend: Invalidate JWT token
   └─ Redirect to login
```

### Transaction Extraction Workflow

```
1. USER UPLOADS DATA
   ├─ Frontend: Select SMS/statement file
   └─ Send to /api/transactions/extract

2. BACKEND PROCESSING
   ├─ Validate session + Organization
   ├─ Parse unstructured data
   ├─ AI extraction (if configured)
   ├─ Validate using schema (Zod)
   ├─ Store in Prisma + PostgreSQL
   └─ Return structured JSON

3. FRONTEND DISPLAY
   ├─ Real-time table rendering
   ├─ Filter & sort options
   └─ Export functionality
```

---

## 🔐 Security Measures

### 1. **Authentication & Authorization**

```typescript
// JWT-based session management with Better-Auth
session: {
  strategy: "jwt",          // Stateless tokens
  expiresIn: 7 * 24 * 60 * 60,  // 7 days
  cookie: {
    httpOnly: true,         // ✅ Prevents XSS attacks
    secure: true,           // ✅ HTTPS only
    sameSite: "none",       // ✅ CSRF protection
    path: "/",
  },
}
```

**What's Protected**:
- ✅ Cookies cannot be accessed by JavaScript (httpOnly)
- ✅ Cookies only sent over HTTPS (secure)
- ✅ CSRF tokens validated for state-changing requests

### 2. **Multi-Tenancy Isolation**

```typescript
// Session middleware enforces organization context
if (!activeOrgId) {
  return c.json({ error: "No active organization selected" }, 403);
}

// Database-level check: User must be member of org
const membership = await prisma.member.findFirst({
  where: {
    userId,
    organizationId: activeOrgId,
  },
});

if (!membership) {
  return c.json(
    { error: "Forbidden: not a member of this organization" },
    403
  );
}
```

**What's Protected**:
- ✅ Users can only access organizations they're members of
- ✅ Role-based access control (admin/member)
- ✅ Data queries scoped to active organization

### 3. **Rate Limiting**

```typescript
rateLimit: {
  enabled: true,
  // Configured in Better-Auth to prevent:
  // - Brute-force password attacks
  // - API abuse
}
```

**Protection Against**:
- ✅ Brute-force login attempts (max 5 per 15 min)
- ✅ Excessive API calls from single IP
- ✅ DDoS-like request patterns

### 4. **CORS Protection**

```typescript
app.use(
  "*",
  cors({
    origin: CLIENT_ORIGIN,  // Only accept requests from frontend
    credentials: true,      // Allow cookies
  })
);
```

**What's Protected**:
- ✅ Only frontend origin can access API
- ✅ Prevents unauthorized cross-origin requests
- ✅ Configurable per environment

### 5. **Input Validation**

```typescript
// Zod schemas validate all request bodies
const transactionSchema = z.object({
  amount: z.number().positive(),
  currency: z.enum(["USD", "EUR", "GBP"]),
  date: z.date(),
  description: z.string().min(1).max(255),
});

// Type-safe validation before DB operations
```

**What's Protected**:
- ✅ Prevents SQL injection (Prisma parameterized queries)
- ✅ Validates data types & formats
- ✅ Enforces business logic constraints

### 6. **Environment Variables**

```env
# Backend (.env)
TOKEN_SECRET=your-secret-key          # JWT signing key
DATABASE_URL=postgresql://...         # DB connection
BASE_URL_CLIENT=https://...           # Allowed frontend origin

# Frontend (.env.local)
NEXT_PUBLIC_API_URL=https://api.../   # Backend endpoint
NEXTAUTH_SECRET=...                   # NextAuth encryption
```

**Best Practices**:
- ✅ Never commit `.env` files
- ✅ Use strong, unique secrets (32+ chars)
- ✅ Rotate secrets regularly
- ✅ Different secrets per environment

### 7. **Database Security**

```prisma
model Session {
  token  String  @unique          // ✅ Unique constraint
  expiresAt DateTime             // ✅ Token expiry
  ipAddress String?              // ✅ Session tracking
  userAgent String?              // ✅ Device tracking
  userId String
  user   User   @relation(..., onDelete: Cascade)  // ✅ Cleanup on delete
}
```

**Protections**:
- ✅ Foreign key constraints (referential integrity)
- ✅ Cascade deletes prevent orphaned records
- ✅ Unique constraints prevent duplicates
- ✅ Session tracking for anomaly detection

---

## 📦 Installation Guide

### Prerequisites

- **Node.js**: v25.0.3 or higher
- **npm** or **yarn**: Latest version
- **PostgreSQL**: v14+ (local or managed service)
- **Git**: For cloning the repository

### Step 1: Clone Repository

```bash
git clone https://github.com/yourusername/as-test-2.git
cd as-test-2
```

### Step 2: Backend Setup

```bash
cd backend

# 1. Install dependencies
npm install

# 2. Create environment file
cp .env.example .env

# 3. Configure your .env file
# Edit with your database URL and secrets
# DATABASE_URL=postgresql://user:password@localhost:5432/vessify_db
# TOKEN_SECRET=your-super-secret-key-min-32-chars
# BASE_URL_CLIENT=http://localhost:3001

# 4. Generate Prisma client
npm run prisma generate

# 5. Run database migrations
npm run prisma migrate deploy

# 6. (Optional) Seed initial data
npm run prisma db seed

cd ..
```

### Step 3: Frontend Setup

```bash
cd frontend

# 1. Install dependencies
npm install

# 2. Create environment file
cp .env.example .env.local

# 3. Configure your .env.local file
# NEXT_PUBLIC_API_URL=http://localhost:3000
# NEXTAUTH_SECRET=your-nextauth-secret

cd ..
```

### Step 4: Start Development Servers

```bash
# Terminal 1: Start Backend (Port 3000)
cd backend
npm run dev

# Terminal 2: Start Frontend (Port 3001)
cd frontend
npm run dev
```

**Expected Output**:
```
Backend: 🚀 Server ready at http://localhost:3000
Frontend: ▲ Next.js ready at http://localhost:3001
```

### Step 5: Access Application

Open your browser and navigate to:
```
http://localhost:3001
```

---

## 🚀 Usage Guide

### User Registration
![Register Page](./frontend/app/screenshots/register.png)
1. Click **"Register"** on login page
2. Enter email and password (min 8 characters)
3. Accept terms and conditions
4. Click **"Create Account"**
5. Auto-redirected to dashboard

### User Login
![Login Page](./frontend/app/screenshots/login.png)
1. Enter registered email
2. Enter password
3. Click **"Login"**
4. Navigate to dashboard on success

### Transaction Extraction
![Transaction Page](./frontend/app/screenshots/dashboard1.png)
![Transaction Page](./frontend/app/screenshots/dashboard2.png)
1. Go to **Dashboard** → **Transactions**
2. Click **"Upload Transaction Data"**
3. Select SMS/Statement file or paste raw data
4. Click **"Extract"**
5. Review and confirm extracted transactions
6. Transactions saved to database automatically

### Transaction Management
![Transaction Page](./frontend/app/screenshots/dashboard3.png)
- **View**: All transactions in table format
- **Filter**: By date range, amount, currency
- **Sort**: By date, amount, merchant name
- **Export**: Download as CSV/PDF

### Multi-Organization

1. Create/invite members to organization
2. Switch organizations from dropdown menu
3. Each org has isolated transaction data
4. Role-based permissions (admin/member)

---

## 🔧 Development Workflow

### Code Organization

```
Feature Branch Workflow:
1. Create feature branch from main
   git checkout -b feature/transaction-export

2. Make changes in backend or frontend (or both)

3. Write tests (required for backend services)
   npm run test

4. Commit with meaningful messages
   git commit -m "feat: add transaction CSV export"

5. Push and create pull request
   git push origin feature/transaction-export

6. Code review → Merge → Deploy
```

### Adding a New API Route

**Backend** (`src/routes/`):

```typescript
import { Hono } from "hono";
import { sessionMiddleware } from "../middleware/session.js";

const myRouter = new Hono();

// Apply session middleware to protected routes
myRouter.post("/action", sessionMiddleware, async (c) => {
  const userId = c.get("userId");
  const orgId = c.get("activeOrgId");
  
  // Your logic here
  return c.json({ success: true });
});

export default myRouter;
```

Then register in `src/index.ts`:

```typescript
import myRouter from "./routes/my.routes.js";
app.route("/api/my-feature", myRouter);
```

### Adding a New Component

**Frontend** (`components/ui/`):

```typescript
import React from "react";

interface MyComponentProps {
  title: string;
  children: React.ReactNode;
}

export function MyComponent({ title, children }: MyComponentProps) {
  return (
    <div className="rounded-lg border p-4">
      <h2 className="font-bold">{title}</h2>
      <div>{children}</div>
    </div>
  );
}
```

Use it:

```typescript
<MyComponent title="Hello">
  <p>Content here</p>
</MyComponent>
```

---

## 🧪 Testing

### Backend Tests

```bash
cd backend

# Run all tests
npm run test

# Run specific test file
npm run test -- isolation.test.ts

# Watch mode (re-run on file changes)
npm run test -- --watch

# Coverage report
npm run test -- --coverage
```

**Test Structure**:
```
tests/
├── mocks/
│   ├── authMock.ts      # Mock auth service
│   └── prismaMock.ts    # Mock database
├── setup/
│   ├── test-app.ts      # Test app instance
│   └── setup.ts         # Jest setup
└── test-suites/
    ├── auth.test.ts     # Auth endpoints
    ├── transactions.test.ts  # Transaction endpoints
    └── user.test.ts     # User operations
```

### Frontend Tests (Optional)

Currently no tests configured. To add:

```bash
cd frontend
npm install --save-dev @testing-library/react jest @testing-library/jest-dom
```

---

## 🚢 Deployment

### Environment Configuration

Update `.env` for production:

```bash
# Backend
NODE_ENV=production
DATABASE_URL=postgresql://prod-user:pwd@prod-host:5432/db
TOKEN_SECRET=<strong-production-secret>
BASE_URL_CLIENT=https://yourdomain.com

# Frontend
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXTAUTH_SECRET=<strong-production-secret>
NEXTAUTH_URL=https://yourdomain.com
```

### Build Commands

```bash
# Backend
cd backend
npm run build
npm run start

# Frontend
cd frontend
npm run build
npm run start
```

### Deployment Targets

- **Backend**: Vercel, Railway, Heroku, AWS EC2, DigitalOcean
- **Frontend**: Vercel (recommended), Netlify, AWS S3 + CloudFront
- **Database**: Managed PostgreSQL (Vercel, Railway, AWS RDS)

### Pre-Deployment Checklist

- ✅ Environment variables configured
- ✅ Database migrations applied
- ✅ Tests passing locally
- ✅ HTTPS enabled
- ✅ CORS origins updated
- ✅ Secrets rotated
- ✅ Error logging configured
- ✅ Database backups enabled

---

## 📚 Additional Resources

- [Hono Documentation](https://hono.dev)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Better-Auth Documentation](https://www.better-auth.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes with clear messages
4. Push to branch
5. Submit pull request with description

---

## 📄 License

This project is proprietary. All rights reserved.

---

## ❓ Support

For issues, questions, or suggestions:

- 📧 Email: support@vessify.com
- 💬 Discord: [Join our community](https://discord.gg/...)
- 📖 Documentation: [Docs Site](https://docs.vessify.com)

---

**Last Updated**: January 2026 | **Maintained by**: Development Team
