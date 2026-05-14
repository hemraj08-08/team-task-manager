# Team Task Manager

A full-stack web application where teams can create projects, assign tasks, manage members, and track progress with role-based access control.

### 🌐 Live Links & Repository
- **Live Application (Frontend):** [https://team-task-manager-liard-chi.vercel.app](https://team-task-manager-liard-chi.vercel.app)
- **Live API (Backend):** [https://team-task-manager-production-66d1.up.railway.app/api/health](https://team-task-manager-production-66d1.up.railway.app/api/health)
- **GitHub Repository:** [https://github.com/hemraj08-08/team-task-manager](https://github.com/hemraj08-08/team-task-manager)

> **Important note for testing the Live App:** The very first user to register an account on the live application is automatically granted the **Admin** role, giving them access to create projects and manage users.

---

## Tech Stack
- **Frontend:** React.js (Vite), Tailwind CSS, React Query, Recharts, React Hook Form, React Router DOM v6
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas (Mongoose)
- **Authentication:** JWT (HTTP-only cookies), bcrypt
- **Deployment:** Vercel (Frontend), Railway (Backend)

---

## Features Implemented
- **User Authentication:** Secure Signup/Login with JWT and password hashing.
- **Role-Based Access Control (RBAC):** Admin and Member roles with specific route and action protections.
- **Project Management:** Complete CRUD operations for projects, including assigning team members.
- **Task Management:** Create tasks, assign priorities, set deadlines, and track status (Pending, In Progress, Completed, Overdue).
- **Interactive Dashboard:** Live aggregation of project metrics, task statuses, and a Recharts pie chart.
- **Task Comments:** Users can communicate via comments on specific task detail pages.

---

## Running Locally

### 1. Backend Setup
1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Open the `.env` file in the `backend` folder and add your **MongoDB URI**.
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/team-task-manager?retryWrites=true&w=majority
   JWT_SECRET=your_super_secret_jwt_key
   CLIENT_URL=http://localhost:5173
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup
1. Open a **new terminal** and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```
4. Open your browser and go to `http://localhost:5173`.
