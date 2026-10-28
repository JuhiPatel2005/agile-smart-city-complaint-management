# Smart City Complaint Management System

A full-stack complaint portal developed for an Agile/Scrum lab project. Citizens register, submit and track civic complaints. Staff can review complaints, update workflow status, manage departments and view analytics. Complaint information is entered directly by the citizen; no LLM, AI inference service, or Ollama installation is required.

## Main features retained
- Citizen registration and login
- Complaint submission and generated complaint ID
- Citizen complaint dashboard and status tracking
- Complaint resubmission flow
- Admin login, dashboard, complaint review and status updates
- Department and analytics pages
- Complaint status workflow and citizen confirmation when a resolved complaint can be closed

## Complaint form fields
- Category: Water Supply & Sewerage, Roads & Infrastructure, Electricity & Street Lighting, or Solid Waste Management
- Description (10–1000 characters)
- Area / street (required)
- City (required)
- Nearby landmark (optional)
- PIN code (optional; if supplied, exactly 6 digits)
- Urgency: Low, Medium, or High

The selected category is used for department routing. The full location and the other citizen-provided details are saved with the complaint. The user's registered name, email and phone remain associated through their account.

## Requirements
- Node.js 20 or newer (Node.js 22 LTS recommended)
- npm
- MongoDB Community Server running locally, or a MongoDB Atlas connection string

No Python, Ollama, Hugging Face token, or model download is needed.

## Setup

### 1. Configure MongoDB
Install and start MongoDB locally, or create a MongoDB Atlas database. If using local MongoDB, the example URI below is suitable for a default local installation.

### 2. Configure the backend
Open a terminal in the project folder:

```bash
cd backend
```

Create a `.env` file by copying `.env.example` and edit the values:

Windows PowerShell:
```powershell
Copy-Item .env.example .env
```

Windows Command Prompt:
```cmd
copy .env.example .env
```

macOS/Linux:
```bash
cp .env.example .env
```

Set `MONGODB_URI` to your database connection string and change `JWT_SECRET`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD`. Then install dependencies and start the API:

```bash
npm install
npm run dev
```

The backend runs at `http://localhost:5000`. Open that URL to check the API health response.

### 3. Create an admin account
With backend `.env` configured, run in a second backend terminal (or stop the dev server first if preferred):

```bash
npm run create-admin
```

Use the admin email/password from `.env` to sign in at `/admin/login`. If the script reports that an admin already exists, use the existing admin credentials.

### 4. Start the frontend
Open a second terminal at the project root:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite, normally `http://localhost:5173`. Register a citizen account, sign in, and submit a test complaint.

## Run backend tests
From the `backend` folder:

```bash
npm test
```

## Suggested manual smoke test
1. Register a citizen account with name, email, phone and password.
2. Sign in and open Report an Issue.
3. Submit all required fields and verify a complaint ID is shown.
4. Open the citizen dashboard and verify the complaint appears.
5. Sign in as admin and verify the complaint appears in the admin complaint list.
6. Change status through the allowed workflow and refresh the citizen tracking page.
7. Test required-field validation, invalid PIN code, and a description shorter than 10 characters.

## Notes
- `.env` is intentionally not included because it contains private database credentials and secrets. Never commit a real `.env` file.
- `frontend` and `backend` dependencies are installed separately.
- The frontend API URL is currently configured for local development at `http://localhost:5000`.
