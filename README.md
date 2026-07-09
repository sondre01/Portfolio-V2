# Portfolio-V2

A clean, modern, and high-performance developer portfolio showcasing dual capabilities in **Data Engineering** and **Data Analytics**. This personal portfolio features premium aesthetics, responsive split-screen layouts, modular stylesheets, real-time telemetry analytics, and database-backed serverless communication.

---

## 🚀 Active Context & Status
* **Current Status**: Production-Ready / Core layouts and database services fully integrated.
* **Latest Updates**:
  * **Interactive Skills Tab Control**: Refactored skills sections into a unified "pill-capsule" segmented control track supporting custom tab transitions (Data Engineer, Data Scientist, Data Analyst).
  * **Real-time Telemetry (Views Counter)**: Dynamic integration with **Supabase** database. Hits database RPC function `increment_views()` on mount and animates rolling count-up increments on scroll.
  * **PostgreSQL Contact Logger & Resend Forwarder**: Replaced standard mail form with a consolidated serverless backend endpoint `/api/submit-message.js`. It securely connects to a Supabase PostgreSQL instance via connection pool (`pg` client), inserts message details to a `portfolio_messages` log table, and delivers a branded, styled HTML alert to the developer via **Resend**.
  * **Certifications Section**: Added a responsive card-based **Certifications & Licenses** section displaying credentials from DataCamp, Cisco, and IBM SkillsBuild/TESDA. Fully integrated into scrollspys, nav menus, and client-side search parsing indices.
  * **UI/UX Refinements**: Stabilized typewriter layout shifts, softened text labels, added social tooltip micro-interactions, and padded form controls for a plush, modern feel.

---

## 🛠️ Technology Stack

### 🖥️ Frontend (Client Side)
* **Languages & Structure**: 
  * **HTML5**: Semantic layout designed for accessibility and indexing.
  * **CSS3 (Vanilla)**: Structured modular stylesheets imported dynamically via `@import` rules inside the main `index.css`. Includes glassmorphic blurs, custom scrollbars, auto-hiding header variables, and responsive media queries.
  * **JavaScript (ES6)**: Vanilla client-side script driving typewriter effects, interactive tab switching, custom resume modals, scroll reveal triggers, and async AJAX form dispatches.
* **CDNs & APIs**:
  * **Supabase Client Library (@supabase/supabase-js)**: Fetched dynamically via CDN to load database operations for page telemetry.
  * **Lucide Icons**: Renders modern icons dynamically on screen.
* **Aesthetics & Typography**: 
  * Font pairings of **Poppins** (for bold headings) and **Inter** (for readable copy).
  * Styled with a signature orange accent (`#ff5e00`) against minimalist grey/white container shadows.

### ⚙️ Backend & Infrastructure (Server Side)
* **Languages & Database**:
  * **JavaScript (Node.js ES6)**: Runs on Vercel's Edge network, exposing endpoint logic securely.
  * **PostgreSQL (pg client driver)**: Connection pool driver supporting database queries inside Vercel Serverless Functions.
* **APIs & Services**:
  * **Supabase Database**: Hosts PostgreSQL tables for logging page view telemetry and portfolio inquiries.
  * **Resend API**: Handles email verification, delivery, and formatting directly using secure API keys on the server.
  * **Devicon & Brandfetch CDNs**: Delivers high-quality tech logos dynamically.

---

## 📦 Project Structure
```
Portfolio V2/
├── .git/
├── api/
│   ├── send-email.js           # Serverless Node.js backend for Resend email dispatch (legacy)
│   └── submit-message.js       # Modern Vercel Serverless Function connecting PostgreSQL + Resend
├── assets/
│   ├── css/                    # Modular, per-section stylesheets
│   │   ├── index.css           # Global stylesheet aggregating all imports
│   │   ├── home.css            # Sidebar, stats, and resume modal styles
│   │   ├── about.css           # About me card and modal styles
│   │   ├── skills.css          # Tech logo cards & interactive tabs styles
│   │   ├── certifications.css  # Certifications & licenses card layout
│   │   ├── education.css       # Education timeline roadmap styles
│   │   ├── work.css            # Work experience and projects stylesheet
│   │   └── contact.css         # Contact card & form submission styles
│   └── js/                     # Client scripts
├── data/
│   ├── documents/              # PDF Resumes (Data Analyst, Science, and Engineer version)
│   ├── image/                  # Profile pictures and assets
│   └── logo/                   # Brand and school logos
├── index.html                  # Main page template (structure & JS logic)
├── package.json                # Project dependencies (pg PostgreSQL driver)
└── README.md                   # Project documentation
```

---

## ⚙️ Configuration & Deployment

### Local Development
1. Open the project folder in **VS Code**.
2. Install the **Live Server** extension.
3. Click **Go Live** on the status bar (serves default port `5501` as configured in `.vscode/settings.json`).

### Deploying to Vercel
Vercel automatically detects static files and maps the `/api` directory to serverless endpoints. 

To enable PostgreSQL database logging and Resend email notifications, configure the following **Environment Variables** in your Vercel Project Settings:
* `DATABASE_URL`: Connection string to your PostgreSQL/Supabase instance (`postgresql://postgres:[PASSWORD]...`).
* `RESEND_API_KEY`: Your private API key generated in the Resend Dashboard.
* `RECIPIENT_EMAIL`: The inbox address where you want to receive the portfolio contact forms.
