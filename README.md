# Portfolio-V2

A clean, modern, and high-performance developer portfolio showcasing dual capabilities in **Software/Web Development** and **IT Systems/DevOps Administration**. This is the second iteration of my personal portfolio, redesigned from the ground up to feature premium aesthetics, responsive split-screen grid layouts, modular stylesheets, and secure serverless backend email integration.

---

## 🚀 Active Context & Status
* **Current Status**: Active Development / Core layouts implemented; Dark Mode, Education, Work, and Contact sections completed.
* **Latest Updates**: Added Vercel and Resend into the Skills section. Integrated an interactive Contact form powered by a Vercel Serverless Function `/api/send-email.js` connected to the Resend API. Implemented a responsive vertical roadmap in the **Education** section, structured stacked rows for Experience/Projects in the **Work** section, and integrated a custom Dark Mode toggler utilizing Lucide icons and localStorage persistence.
* **Next Steps**: Conduct general visual polish and prepare for production deployment.

---

## 🛠️ Technology Stack

### 🖥️ Frontend (Client Side)
* **Languages**: 
  * **HTML5**: Semantic document layout designed for accessibility and indexing.
  * **CSS3 (Vanilla)**: Structured modular stylesheets imported dynamically via `@import` rules inside the main `index.css`. Includes glassmorphic blurs, custom scrollbars, auto-hiding header variables, and responsive media queries.
  * **JavaScript (ES6)**: Vanilla client-side script driving custom resume modals, scroll reveal triggers via `IntersectionObserver`, cycler widgets for input prompts, and asynchronous AJAX form dispatches.
* **Aesthetics & Typography**: 
  * Font pairings of **Poppins** (for bold headings) and **Inter** (for readable copy).
  * Styled with a bright signature orange accent (`#ff5e00`) against minimalist grey/white container shadows.

### ⚙️ Backend & Infrastructure (Server Side)
* **Languages**:
  * **JavaScript (Node.js ES6)**: Used to write lightweight cloud serverless scripts.
* **Runtime & Framework**: 
  * **Vercel Serverless Functions**: Runs on Vercel's edge network, exposing endpoint logic securely at `/api/send-email`.
* **APIs & Services**:
  * **Resend API**: Handles email verification, delivery, and formatting directly using secure API keys on the server.
  * **Devicon & Brandfetch CDNs**: Delivers high-quality tech logos dynamically.

---

## 📦 Project Structure
```
Portfolio V2/
├── .vscode/
│   └── settings.json           # Live Server configurations (Port 5501)
├── api/
│   └── send-email.js           # Serverless Node.js backend for Resend email dispatch
├── assets/
│   ├── css/                    # Modular, per-section stylesheets
│   │   ├── index.css           # Global stylesheet aggregating all imports
│   │   ├── home.css            # Sidebar, stats, and resume modal styles
│   │   ├── about.css           # About me card and modal styles
│   │   ├── skills.css          # Tech logo cards & specialists list styles
│   │   ├── education.css       # Education timeline roadmap styles
│   │   ├── work.css            # Work experience and projects stylesheet
│   │   └── contact.css         # Contact card & form submission styles
│   └── js/                     # [Reserved] Future client scripts
├── data/
│   ├── documents/              # PDF Resumes (Data Analyst, Science, and Engineer version)
│   ├── image/                  # Profile pictures and assets
│   └── logo/                   # Brand and school logos
├── index.html                  # Main page template (structure & JS logic)
└── README.md                   # Project documentation
```

---

## ⚙️ Configuration & Deployment

### Local Development
1. Open the project folder in **VS Code**.
2. Install the **Live Server** extension.
3. Click **Go Live** on the status bar (serves default port `5501` as configured in `.vscode/settings.json`).

### Deploying to Vercel
Vercel automatically detects the static files and maps the `/api` directory to serverless endpoints. 

To enable email notifications, add the following **Environment Variables** in your Vercel Project Settings:
* `RESEND_API_KEY`: Your private API key generated in the Resend Dashboard.
* `RECIPIENT_EMAIL`: The inbox address where you want to receive the portfolio contact forms.
