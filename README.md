# JobPortal

A full-stack job portal in the style of the Patel MernStack MERN tutorial: students search and apply, recruiters manage companies, jobs, and applicants.

Stack: React (Vite), Redux Toolkit, Tailwind CSS, Node, Express, MongoDB.

MongoDB runs as an embedded database in `backend/data/mongo`, so you do not need a separate MongoDB install. Set `MONGO_URI` in `backend/.env` if you want Atlas or your own server instead. Uploads (logos, photos, resumes) stay in `backend/uploads`.

On Vercel the site and the API share one address. Set `MONGODB_URI` (or `MONGO_URI`) and `JWT_SECRET` in the project settings. Leave those values out of git. Uploads on Vercel are stored in the database.

## Run

```powershell
cd C:\Users\ADITYA\Desktop\job-portal
npm install
npm install --prefix backend
npm install --prefix frontend
npm run dev
```

Open http://localhost:5173. The API is http://localhost:8000.

The live site is https://job-portal-pied-omega.vercel.app. Source: https://github.com/LENGND123/job-portal.

## Demo accounts

| Role | Email | Password |
| --- | --- | --- |
| Student | student@jobhunt.dev | student123 |
| Recruiter | recruiter@jobhunt.dev | recruiter123 |

Sign up creates a real account too. Pick Student or Recruiter on both the signup and login forms. The role has to match the account.
