# 🧗 [BoulderTracker](https://bouldertracker.vercel.app)

BoulderTracker is a full-stack web application for tracking climbing sessions, logging attempts, and managing climbs. Built with **Node.js, Express, SQLite**, and a **React + Vite frontend**, it provides climbers with an easy way to record progress, review past sessions, and analyze performance over time.  

---

## 🚀 Features  

- **Secure Authentication**  
  - User registration & login with **bcrypt** password hashing.  
  - **JWT-based authentication** for secure access to protected routes.  

- **Climb Management**  
  - Add new climbs with name, difficulty, and color.  
  - Update or delete existing climbs.  

- **Sessions & Logs**  
  - Create climbing sessions (e.g., by date).  
  - Add climb logs to a session, including:  
    - Number of attempts  
    - Whether it was flashed  
    - Whether it was topped  
  - View past sessions and logs.  

- **Database Design**  
  - Relational schema with **SQLite**.  
  - **Cascade deletion** ensures clean data management when users/sessions/climbs are removed.  


---

## 🛠️ Tech Stack  

**Frontend:**  
- React (Vite)  
- Chakra UI (component styling)
- Recharts
- React Hot Toast
- React Router  

**Backend:**  
- Node.js + Express  
- JWT (authentication)  
- Bcrypt (password hashing)  

**Database:**  
- SQLite3  

---

