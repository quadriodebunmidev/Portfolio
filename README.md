# finesseDev Portfolio — Odebunmi Quadri

A full-stack developer portfolio with admin panel, Three.js 3D animations, and Groq AI chatbot.

## Tech Stack
- **Frontend**: React (Vite), Three.js, React Router
- **Backend**: Node.js, Express, MongoDB, JWT
- **AI Chat**: Groq API (llama3-8b-8192)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- A Groq API key (free at https://console.groq.com)

---

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your values
npm run dev
```

Your `.env` file:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/finesse-portfolio
JWT_SECRET=your_super_secret_key_here
ADMIN_USERNAME=admin
ADMIN_PASSWORD=finesseDev2024!
GROQ_API_KEY=gsk_your_groq_key_here
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Visit: http://localhost:5173

---

### 3. Seed the Database

After both servers are running, seed sample data:

```
POST http://localhost:5000/api/seed
```

Or click the **"Seed DB"** button in the Admin Panel.

---

## Admin Panel

Visit `/admin/login` or click "Admin" in the navbar.

Default credentials (set in `.env`):
- Username: `admin`
- Password: `finesseDev2024!`

### Admin features:
- ✅ Add / Edit / Delete Projects
- ✅ Add / Edit / Delete Skills  
- ✅ Add / Edit / Delete Experience
- ✅ View / Mark Read / Delete Messages

---

## AI Chatbot

The floating chat bubble (bottom right) is powered by Groq's llama3-8b-8192 model.
It's pre-configured with context about Quadri's background, skills, and projects.

**Requires**: `GROQ_API_KEY` in backend `.env`

Get a free key at: https://console.groq.com

---

## Portfolio Sections

1. **Hero** — Three.js torus knot + particle field with mouse parallax
2. **About** — Bio and links
3. **Skills** — Interactive 3D skill globe (drag to rotate) + skill bars
4. **Projects** — Filterable project grid
5. **Experience** — Tab-style work history
6. **Contact** — Message form (saved to DB, viewable in admin)

---

## Deployment

### Backend (Railway / Render / Heroku)
```bash
cd backend && npm start
```

### Frontend (Vercel / Netlify)
```bash
cd frontend && npm run build
# Deploy the dist/ folder
# Set VITE_API_URL if backend is on a different domain
```

Update `vite.config.js` proxy target for production.
