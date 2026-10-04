# FinTrack AI — AI-Powered Personal Expense Tracker

A full-stack MERN application that goes beyond basic expense tracking by using AI to automatically categorize transactions and generate personalized budget advice based on a user's real spending data.

Built as a solo project to demonstrate production-style backend architecture (JWT auth with access + refresh tokens, ownership-based authorization, MongoDB aggregation) combined with a real AI integration (Google Gemini) — not just a CRUD app with AI bolted on as an afterthought.

---

## Live Demo & Screenshots

> *(Add your deployed link and 2–3 screenshots here — Dashboard, AI Advisor page, and the "AI" badge on an auto-categorized transaction work well.)*

---

## Key Features

### 🔐 Secure Authentication
- Email/password registration and login with **bcrypt** password hashing
- **Access token + refresh token** pattern (short-lived access token, long-lived refresh token)
- Refresh token stored in an **httpOnly, secure, sameSite cookie** — never exposed to client-side JavaScript
- Refresh tokens are also persisted server-side, so logout immediately invalidates the session rather than waiting for natural token expiry
- Silent token refresh — users stay logged in without re-entering credentials

### 🤖 AI-Powered Transaction Categorization
- When a user adds a transaction without manually selecting a category, the backend sends the transaction description to **Google Gemini**
- The AI picks the best-fitting category from the user's own existing categories (never invents new ones)
- Every transaction tracks `categorySource: "manual" | "ai"`, so the UI can show which transactions were auto-categorized

### 📊 RAG-Style Budget Advisor
- A dedicated endpoint **retrieves** the user's real spending data (via a MongoDB aggregation pipeline) and current budget limits
- That data is **injected as context** into a prompt sent to Gemini
- The AI **generates** specific, personalized advice grounded in the user's actual numbers (not generic financial tips)
- This is a practical, lightweight implementation of the Retrieval-Augmented Generation (RAG) pattern using structured data instead of a vector database

### 📁 Bulk Transaction Import (CSV)
- Upload a CSV file of transactions in one request
- Each row is validated, auto-categorized by AI, and bulk-inserted into the database
- Returns a summary (rows imported, rows failed, and the reason for each failure) rather than failing the whole batch on one bad row

### 💰 Full Budget & Category Management
- Set monthly spending limits per category
- Database-level duplicate prevention (a user cannot set two budgets for the same category in the same month) using a MongoDB compound unique index
- Visual progress bars showing spend vs. limit, color-coded by how close the user is to overspending

### 📈 Visual Dashboard
- Summary cards (total income, total expense, transaction count)
- Pie chart — spending broken down by category
- Bar chart — monthly spending trend
- Recent transactions feed

### 🛡️ Authorization, Not Just Authentication
- Every write/delete operation checks that the resource (transaction, category, budget) actually belongs to the requesting user — not just that *someone* is logged in
- Prevents one user from modifying or deleting another user's data, even if they guess a valid resource ID

---

## Tech Stack

**Backend**
- Node.js + Express
- MongoDB + Mongoose (schema design, aggregation pipelines, compound unique indexes)
- JWT (`jsonwebtoken`) for access/refresh token authentication
- bcrypt for password hashing
- Multer + csv-parser for file upload and CSV processing
- Google Generative AI SDK (Gemini) for categorization and advisory features

**Frontend**
- React (Vite)
- Tailwind CSS
- React Router (protected routes)
- Axios (with request interceptors for auth headers)
- Recharts (data visualization)
- React Context API for global auth state

---

## Architecture

```
backend/
├── src/
│   ├── config/         # Database connection
│   ├── models/         # User, Category, Transaction, Budget (Mongoose schemas)
│   ├── controllers/     # Business logic, separated by resource
│   ├── routes/          # Express routers, one per resource
│   ├── middleware/       # JWT auth verification, Multer upload config
│   ├── services/         # AI service layer (Gemini prompt logic, isolated from controllers)
│   └── server.js
frontend/
├── src/
│   ├── api/              # Axios service functions, one file per resource
│   ├── context/          # AuthContext — global auth state
│   ├── components/        # Reusable UI pieces (forms, layout, CSV upload)
│   ├── pages/              # Route-level screens
│   └── routes/              # ProtectedRoute wrapper
```

The AI logic is intentionally isolated in a `services/` layer rather than written directly inside controllers — controllers stay focused on request/response handling, and the AI prompt logic is reusable (used by both transaction categorization and the budget advisor) and independently testable.

---

## API Overview

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Log in |
| POST | `/api/auth/refresh` | Get a new access token using the refresh cookie |
| POST | `/api/auth/logout` | Invalidate the refresh token |
| GET | `/api/transactions` | List the user's transactions (with populated category) |
| POST | `/api/transactions` | Create a transaction — omit `category` to let AI decide |
| PUT | `/api/transactions/:id` | Update a transaction (partial update supported) |
| DELETE | `/api/transactions/:id` | Delete a transaction |
| POST | `/api/transactions/upload-csv` | Bulk import transactions from a CSV file |
| GET | `/api/categories` | List default + user's custom categories |
| POST | `/api/categories` | Create a custom category |
| DELETE | `/api/categories/:id` | Delete a custom category (default categories are protected) |
| GET | `/api/budgets` | List this month's budgets |
| POST | `/api/budgets` | Set a budget for a category |
| PUT | `/api/budgets/:id` | Update a budget limit |
| DELETE | `/api/budgets/:id` | Delete a budget |
| GET | `/api/advisor/insights` | Get AI-generated budget advice based on real spending data |

All routes except `/register`, `/login`, and `/refresh` require a valid access token in the `Authorization: Bearer <token>` header.

---

## Getting Started

### Prerequisites
- Node.js
- A MongoDB Atlas connection string
- A Google Gemini API key ([aistudio.google.com](https://aistudio.google.com))

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_ACCESS_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret
GEMINI_API_KEY=your_gemini_api_key
```

```bash
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## What This Project Demonstrates

- Designing a secure, production-style authentication flow (not just "store a JWT in localStorage")
- Enforcing authorization and data ownership at the API layer, not just authentication
- Using MongoDB's aggregation framework for real analytical queries instead of pulling raw data and processing it in application code
- Integrating a real LLM into a product feature with deliberate prompt design and output validation — rather than passing user input straight to an AI and trusting whatever comes back
- Implementing a practical RAG pattern: retrieving real application data and grounding AI output in it
- Handling file uploads and bulk data processing safely (validation, partial-failure reporting, cleanup)
- Structuring a full-stack codebase so backend and frontend both separate concerns cleanly (service layers, API clients, context-based state)

---

## Possible Future Improvements

- Google OAuth login
- Recurring/scheduled transactions
- Multi-currency support
- Push/email notifications for budget overrun
- Export reports as PDF
