# Team Task Manager

A full-stack web application where teams can create projects, assign tasks, manage members, and track progress with role-based access control.

### 🌐 Live Application
- **Live Link (Unified Full-Stack):** [https://team-task-manager-production-66d1.up.railway.app](https://team-task-manager-production-66d1.up.railway.app)
- **GitHub Repository:** [https://github.com/hemraj08-08/team-task-manager](https://github.com/hemraj08-08/team-task-manager)

> **Important note for testing:** The very first user to register an account on the live application is automatically granted the **Admin** role, giving them access to create projects and manage users.

---

## Tech Stack
- **Frontend:** React.js (Vite), Tailwind CSS, React Query, Recharts
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas (Mongoose)
- **Authentication:** JWT, bcrypt
- **Deployment:** Railway (Full-stack unified deployment)

---

## Features Implemented
- **User Authentication:** Secure Signup/Login with JWT and password hashing.
- **Role-Based Access Control (RBAC):** Admin and Member roles with specific route and action protections.
- **Project Management:** Complete CRUD operations for projects, including assigning team members.
- **Task Management:** Create tasks, assign priorities, set deadlines, and track status.
- **Interactive Dashboard:** Live aggregation of project metrics and task statuses.

---

## Running Locally

### 1. Backend Setup
1. Navigate to the `backend` folder: `cd backend`
2. Install dependencies: `npm install`
3. Configure `.env` with `MONGO_URI`, `JWT_SECRET`, and `PORT`.
4. Start the server: `npm run dev`

### 2. Frontend Setup
1. Navigate to the `frontend` folder: `cd frontend`
2. Install dependencies: `npm install`
3. Start the dev server: `npm run dev`
4. Access at `http://localhost:5173`
