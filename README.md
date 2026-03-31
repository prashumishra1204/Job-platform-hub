<div align="center">
  <h1>🎯 Job Platform Hub</h1>
  <p><strong>Enterprise-Grade Job Board Platform | Connecting Talent with Opportunity</strong></p>
  
  <!-- Badges -->
  <a href="https://github.com/prashumishra1204/Job-platform-hub/stargazers">
    <img src="https://img.shields.io/github/stars/prashumishra1204/Job-platform-hub" alt="Stars">
  </a>
  <a href="https://github.com/prashumishra1204/Job-platform-hub/network/members">
    <img src="https://img.shields.io/github/forks/prashumishra1204/Job-platform-hub" alt="Forks">
  </a>
  <a href="https://github.com/prashumishra1204/Job-platform-hub/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License">
  </a>
  <a href="https://github.com/prashumishra1204/Job-platform-hub/issues">
    <img src="https://img.shields.io/github/issues/prashumishra1204/Job-platform-hub" alt="Issues">
  </a>
  <a href="https://github.com/prashumishra1204/Job-platform-hub/pulls">
    <img src="https://img.shields.io/github/issues-pr/prashumishra1204/Job-platform-hub" alt="Pull Requests">
  </a>
  <img src="https://img.shields.io/badge/HTML-61.8%25-orange" alt="HTML">
  <img src="https://img.shields.io/badge/Python-38.2%25-blue" alt="Python">
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs Welcome">
  
  <br><br>
  <h3>Created with ❤️ by <strong>Prashu Mishra</strong></h3>
  <p>Full Stack Developer | Job Platform Creator</p>
  
  <br>
  <img src="https://via.placeholder.com/800x400/2563eb/ffffff?text=Job+Platform+Hub+Screenshot" alt="Job Platform Hub Screenshot" width="800">
</div>

A scalable job platform connecting job seekers, recruiters, and employers with a modern web interface and evolving cloud-native architecture. The project currently runs with a hybrid setup (static frontend + Flask backend APIs) and is being upgraded toward a fully serverless edge-based system using Cloudflare.

---

## 🚀 Live Demo

* GitHub Pages: https://prashumishra1204.github.io/Job-platform-hub/
* Cloudflare Workers: https://job-platform-hub.prashumishra714.workers.dev/

---

## 📌 Features Overview

| Category        | Live Features (v1.0 - Current)                       | Upcoming Features (v2.0 - Target)                    |
| --------------- | ---------------------------------------------------- | ---------------------------------------------------- |
| UI/UX           | Responsive UI, job listings, dashboards              | Modern UI with React + Next.js, SSR/SSG, improved UX |
| Job Management  | Create, edit, browse jobs                            | Fully dynamic job APIs with optimized queries        |
| Backend         | Flask-based session API (running)                    | Cloudflare Workers serverless backend                |
| Database        | LocalStorage + sessionStorage + Flask DB integration | PostgreSQL + Cloudflare D1                           |
| Authentication  | Session-based authentication                         | JWT + OAuth2 + Cloudflare Access                     |
| Performance     | CDN delivery via GitHub/Cloudflare                   | Edge caching with KV + global optimization           |
| File Storage    | Not available                                        | Cloudflare R2 for resume uploads                     |
| AI Features     | Not available                                        | AI job recommendations & resume matching             |
| Scalability     | Supports limited users                               | Scalable to 2000+ concurrent users                   |
| Search & Filter | Keyword + filter system                              | Advanced search with indexing & pagination           |
| Security        | Basic session security                               | WAF, DDoS protection, rate limiting                  |
| Monitoring      | Not available                                        | Cloudflare Analytics + Workers metrics               |
| Notifications   | Not available                                        | Email + WebSockets real-time updates                 |

---

## 🏗️ Architecture Comparison

| Component     | Current — v1.0                                 | Target — v2.0                         |
| ------------- | ---------------------------------------------- | ------------------------------------- |
| Frontend      | Static HTML5 / CSS3 / JS ES6+                  | React 18 + Next.js 14 (SSR/SSG)       |
| Backend       | Flask (session-based API)                      | Cloudflare Workers (serverless edge)  |
| Database      | LocalStorage / SessionStorage + DB integration | PostgreSQL + Cloudflare D1            |
| Cache         | None                                           | Cloudflare KV (edge cache)            |
| File Storage  | None                                           | Cloudflare R2                         |
| Auth          | Session-based                                  | JWT + OAuth2                          |
| Hosting       | GitHub Pages / Cloudflare Workers              | Cloudflare Pages (production)         |
| CDN           | Basic CDN                                      | Cloudflare Global Network (200+ PoPs) |
| Notifications | None                                           | Email + WebSockets                    |
| CI/CD         | Manual deploy                                  | GitHub Actions → Cloudflare           |
| Monitoring    | None                                           | Cloudflare Analytics                  |
| Security      | Basic                                          | WAF + DDoS + Rate Limiting            |

---

## 🧠 Technology Stack

### Frontend

| Technology             | Version | Purpose               |
| ---------------------- | ------- | --------------------- |
| HTML5                  | Latest  | Structure             |
| CSS3                   | Latest  | Styling & layout      |
| JavaScript             | ES6+    | Logic & interactivity |
| Font Awesome           | 6.0     | Icons                 |
| Google Fonts (Poppins) | Latest  | Typography            |

---

### Backend & Data

| Technology           | Purpose                            |
| -------------------- | ---------------------------------- |
| Flask (current)      | Session-based backend API handling |
| localStorage         | Persistent client-side data        |
| sessionStorage       | Temporary session data             |
| PostgreSQL (v2.0)    | Primary relational database        |
| Cloudflare KV (v2.0) | Edge caching                       |
| Cloudflare D1 (v2.0) | Edge database                      |
| Cloudflare R2 (v2.0) | File storage                       |

---

### Development & Deployment

| Tool             | Category        | Purpose            |
| ---------------- | --------------- | ------------------ |
| VS Code          | IDE             | Development        |
| Git              | Version Control | Code management    |
| GitHub           | Hosting         | Repo & CI trigger  |
| Chrome DevTools  | Debugging       | Testing            |
| Wrangler CLI     | Cloudflare      | Deploy Workers     |
| Cloudflare Pages | Hosting         | Primary deployment |
| GitHub Pages     | Hosting         | Backup deployment  |

---

## ⚙️ Features Implemented

### 👤 User Management

| Feature                 | Status   | Details                         |
| ----------------------- | -------- | ------------------------------- |
| Multi-role Registration | Complete | Employee / Employer / Recruiter |
| Secure Login / Logout   | Complete | Session-based authentication    |
| Session Persistence     | Complete | Maintained via storage          |
| Profile Management      | Complete | Editable user profiles          |
| Role-Based Access       | Complete | Permission-based system         |

---

### 💼 Job Management

| Feature         | Status   | Details              |
| --------------- | -------- | -------------------- |
| Job Posting     | Complete | Create & manage jobs |
| Job Browsing    | Complete | Paginated UI         |
| Job Details     | Complete | Full job info        |
| Search & Filter | Complete | Keyword & filters    |
| Save Jobs       | Complete | Bookmark feature     |
| Share Jobs      | Complete | Social sharing       |

---

### 📄 Application System

| Feature              | Status   | Details                   |
| -------------------- | -------- | ------------------------- |
| Apply for Jobs       | Complete | One-click apply           |
| Track Applications   | Complete | Dashboard tracking        |
| Application History  | Complete | Logs with timestamps      |
| Status Updates       | Complete | Hiring workflow           |
| Duplicate Prevention | Complete | No duplicate applications |

---

## 🔐 User Roles & Permissions

| Permission      | Employee | Employer | Recruiter | Admin |
| --------------- | -------- | -------- | --------- | ----- |
| Browse Jobs     | Yes      | Yes      | Yes       | Yes   |
| Apply for Jobs  | Yes      | No       | No        | No    |
| Save Jobs       | Yes      | No       | No        | No    |
| Post Jobs       | No       | Yes      | Yes       | Yes   |
| Edit Jobs       | No       | Yes      | Yes       | Yes   |
| View Applicants | No       | Yes      | Yes       | Yes   |
| Update Status   | No       | Yes      | Yes       | Yes   |
| Analytics       | No       | Yes      | Yes       | Yes   |
| Manage Users    | No       | No       | No        | Yes   |

---

## ⚡ Performance

* Fast delivery via CDN
* Optimized frontend assets
* Session-based backend for faster interactions

---

## 🔒 Current Limitations

* Hybrid architecture (not fully scalable yet)
* Session-based auth (not production-grade)
* Limited backend scalability

---

## 🔮 Future Enhancements (v2.0)

* Full serverless backend using Cloudflare Workers
* PostgreSQL + D1 integration
* AI-powered job matching
* Resume parsing & ranking
* Real-time notifications
* Edge caching & performance optimization
* Scalable architecture for 2000+ users
* Secure JWT authentication
* CI/CD automation

---

## 🤝 Contributing

Contributions are welcome via pull requests.

---

## 📄 License

MIT License

---

## 👨‍💻 Author

Prashu Mishra
