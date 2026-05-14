# Team Task Manager

A full-stack web application where teams can create projects, assign tasks, manage members, and track progress with role-based access control.

## Tech Stack
- **Frontend:** React (Vite), Tailwind CSS, React Query, Recharts, React Hook Form
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT (HTTP-only cookies), bcrypt

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
3. Open the `.env` file in the `backend` folder and add your **MongoDB URI**. (The JWT secret is already filled).
   ```env
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/team-task-manager?retryWrites=true&w=majority
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

> **Note:** The first user to register automatically becomes an `admin`.

---

## Deployment Guide

### 1. Deploying Backend to Railway
1. Push your code to a GitHub repository.
2. Go to [Railway](https://railway.app/) and click **New Project** -> **Deploy from GitHub repo**.
3. Select your repository. 
4. Railway will auto-detect the Node.js backend. To ensure it only builds the backend, set the **Root Directory** in Railway settings to `/backend`.
5. Add the following **Environment Variables** in Railway:
   - `PORT` = `5000`
   - `MONGO_URI` = `<your_production_mongodb_uri>`
   - `JWT_SECRET` = `<a_strong_secret_key>`
   - `CLIENT_URL` = `<your_vercel_frontend_url>`
6. Wait for the deployment to finish and copy the provided Railway domain URL.

### 2. Deploying Frontend to Vercel
1. Go to [Vercel](https://vercel.com/) and click **Add New Project**.
2. Select your GitHub repository.
3. Vercel will auto-detect Vite. Set the **Root Directory** to `frontend`.
4. Add the following **Environment Variable**:
   - `VITE_API_URL` = `<your_railway_backend_url>` (Note: You may need to update the `vite.config.js` proxy or `src/services/api.js` base URL to use this env variable in production).
   *To quickly update `api.js` for production:*
   ```javascript
   const API = axios.create({
     baseURL: import.meta.env.VITE_API_URL || '/api',
     // ...
   })
   ```
5. Click **Deploy**.

Enjoy your Team Task Manager app!
