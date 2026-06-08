# 💧 HydroTrack: Advanced Water Intake Monitoring & Hydration Reminder System

**🚀 Live Demo:** [https://water-intake-monitoring-j8czty973-sourabhkamble24s-projects.vercel.app](https://water-intake-monitoring-j8czty973-sourabhkamble24s-projects.vercel.app)

A full-stack, modern web application designed to help users track their daily water intake, stay hydrated, and build healthy habits through smart reminders and gamification.

## ✨ Features

- **🔐 Secure Authentication:** Complete user system with Login, Registration, Forgot Password, and "Remember Me" functionality.
- **📊 Interactive Dashboard:** A beautiful glassmorphism-inspired dashboard to track your hydration progress.
- **🌊 Visual Progress Indicator:** Dynamic animated wave and bubble effects showing real-time daily goal completion.
- **🌤️ Smart Weather Integration:** Automatically adjusts your daily hydration goals based on your local temperature and humidity.
- **🎮 Gamification:** Earn points for every log, level up, and unlock achievements (like the "First Drop" badge) to stay motivated.
- **🌱 Virtual Plant:** Watch your virtual plant grow as you consistently hit your hydration targets.
- **📈 Advanced Analytics:** Detailed weekly and monthly bar/area charts (powered by Recharts) to track your intake trends, average daily consumption, and best streaks.
- **⚙️ User Preferences:** Fully customizable settings including avatar uploads, daily base goals, weight-based calculations, dark/light mode toggle, and CSV data export.

## 🛠️ Technology Stack

**Frontend:**
- [React.js](https://reactjs.org/) (bootstrapped with Vite)
- [Tailwind CSS](https://tailwindcss.com/) for modern, responsive, and glassmorphic styling
- [Framer Motion](https://www.framer.com/motion/) for smooth animations
- [Recharts](https://recharts.org/) for data visualization
- [Lucide React](https://lucide.dev/) for beautiful icons

**Backend:**
- [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/)
- [Supabase](https://supabase.com/) for PostgreSQL Database and User Management

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites
- Node.js (v16 or higher)
- A Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SourabhKamble24/Water-intake-monitoring.git
   cd Water-intake-monitoring
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` directory:
   ```env
   PORT=5000
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   JWT_SECRET=your_jwt_secret
   ```

3. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   ```
   Create a `.env` file in the `frontend` directory (if needed):
   ```env
   VITE_API_URL=http://localhost:5000
   ```

4. **Database Setup (Supabase)**
   You will need to create the following tables in your Supabase project:
   - `users` (id, email, name, daily_goal, points, level, etc.)
   - `water_logs` (id, user_id, amount_ml, timestamp)
   - `achievements` (id, user_id, title, description, date_earned)

### Running the Application

Open two terminal windows.

**Terminal 1 (Backend):**
```bash
cd backend
npm start
```
*The server will start on http://localhost:5000*

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```
*The React app will open on http://localhost:5173*

## 🎨 Design

The UI is built with a premium **Glassmorphism** aesthetic, utilizing translucent backgrounds, subtle borders, and vibrant gradients to create a visually stunning experience.

## 📄 License

This project is open-source and available under the MIT License.
