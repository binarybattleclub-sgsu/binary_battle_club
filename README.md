# Binary Battle Club – Official Website Frontend

> **Think. Code. Create. Compete.**  
> A Student-Driven Coding, Technology and Innovation Community of **Scope Global Skills University (SGSU)**, Bhopal.

---

## 🌟 Overview

This repository contains the complete, modern, responsive frontend portal for **Binary Battle Club** — the premier student-led technology community at Scope Global Skills University (SGSU), Bhopal.

Built with a dashboard-inspired layout, the website combines a dark navy sidebar with a clean, high-contrast light main content canvas, accented with vivid electric indigo and purple tones. All visual assets and photographic records have been extracted directly from the official **"Binary Battle Club.pptx"** presentation.

---

## 🚀 Technology Stack

- **React 18** + **Vite 6**
- **TypeScript 5**
- **Tailwind CSS 3**
- **React Router DOM 6**
- **Lucide React** + Custom SVG brand icons
- **Modular Mock Data** architecture (`src/data/`)

---

## 🧭 Navigation & Sections

The portal features all 8 core sections accessible via the fixed collapsible sidebar and mobile navigation drawer:

1. **Home (`/`)**
   - Hero banner with university affiliation and club motto: *Think. Code. Create. Compete.*
   - Four interactive pillar cards (*Explore Technologies*, *Code & Compete*, *Innovate & Build*, *Hackathons*)
   - Quick previews for *Latest Activities*, *Upcoming Events*, and *Recent Achievements*
   - Direct call-to-action buttons for joining and exploring.

2. **About Us (`/about`)**
   - Heading: *"A Club by the Students, for the Students"*
   - Vision & Mission statements
   - 2x2 grid representing what the club stands for:
     - 01. *Explore Technologies*
     - 02. *Code & Compete*
     - 03. *Innovate & Build*
     - 04. *Organise, Achieve & Lead*
   - School of Future Skills and Information Technology background.

3. **Explore Technologies (`/explore-technologies`)**
   - **Latest Technology & AI Updates**: Filterable articles on Generative AI, Machine Learning, WebAssembly, and Developer Tools.
   - **Friday Learning Sessions**: *"Friday – Learn, Explore & Experiment"* weekly laboratory series at SGSU.
   - **Mini Coding Competitions**: Internal algorithmic sprints, debugging duels, and AI challenges.
   - **Tutorials & Learning Resources**: Social media hub with YouTube and Instagram resource cards.

4. **Code & Compete (`/code-compete`)**
   - Hands-on workshop gallery (Gemini AI Masterclass, Google Stitch Workshop, AI Leadership Challenge, Friday Workshops).
   - Category filtering (*AI Workshops*, *Coding Workshops*, *Masterclasses*, *External Workshops*).
   - **Beyond Our Campus** section: Inter-university outreach at RNTU (Rabindranath Tagore University), Rajiv Gandhi College, LNCT College, and BSS College.
   - Modal with photo galleries and key highlights.

5. **Innovate & Build (`/innovate-build`)**
   - Student project gallery featuring student names, roles, avatars, descriptions, and technology tags.
   - Live search box across project titles, descriptions, and technologies.
   - Category filters (*AI Projects*, *Web Development*, *Mobile Applications*, *Cybersecurity*, *Others*).
   - "View Project" and GitHub repository links opening in new browser tabs.

6. **Hackathons (`/hackathons`)**
   - Featured event cards:
     - **12-Hour Internal Hackathon** (Scope Global Skills University)
     - **24-Hour Hackathon – Navonamesh** (Overnight competitive external hackathon)
     - **Google-Powered Hackathon** (Upcoming flagship sprint with distinctive status badge)
   - Interactive photo gallery modal showcasing event photography from the PPT.

7. **Achievements (`/achievements`)**
   - Hall of Triumphs with official records extracted from the PPT:
     - *BGI Hackathon Winners (13th & 14th May)*
     - *National Champions – 36th National WorkSkills Competition*
     - *INNOverse 2024 Showcase Delegation*
     - *Four Teams Selected for Final Round (26th & 27th September)*
     - *CII 2026 – Web Technology, Siddhesh Kewate*
   - Filterable categories with trophy, medal, and award badges.

8. **Join the Community (`/join-community`)**
   - Student membership application form with client-side validation.
   - Fields: Full Name, University Email, Student ID, School/Department, Programme, Semester, Area of Interest, Motivation, and Membership Category.
   - Instant validation and submission feedback with frontend demonstration notice.

---

## 📁 Project Structure

```
├── public/
│   └── images/
│       ├── brand/               # Official Binary Battle Club logo
│       ├── workshops/           # Friday labs, RNTU trainings, college outreach
│       ├── hackathons/          # SGSU 12-hour & Navonamesh 24-hour hackathons
│       ├── achievements/        # BGI winners, WorkSkills champions, CII award
│       ├── student_projects/    # Student project screenshots and UI demos
│       └── technology_updates/  # AI and tutorial sharing infographics
├── src/
│   ├── components/
│   │   ├── Sidebar.tsx          # Fixed collapsible sidebar
│   │   ├── Header.tsx           # Sticky mobile top bar
│   │   ├── Footer.tsx           # Comprehensive university footer
│   │   ├── SectionHeading.tsx   # Reusable section header
│   │   ├── ProjectCard.tsx      # Student project card
│   │   ├── WorkshopCard.tsx     # Workshop & masterclass card
│   │   ├── HackathonCard.tsx    # Hackathon feature card
│   │   ├── AchievementCard.tsx  # Award & achievement card
│   │   ├── EventModal.tsx       # Photo gallery & event modal
│   │   ├── MembershipForm.tsx   # Registration form with validation
│   │   └── SocialIcons.tsx      # SVG social & brand icons
│   ├── data/
│   │   ├── assets.ts            # Central image asset mapping
│   │   ├── technologyUpdates.ts # Tech news, Friday labs, mini contests
│   │   ├── workshops.ts         # Workshop & masterclass records
│   │   ├── projects.ts          # Student projects database
│   │   ├── hackathons.ts        # Hackathon details and gallery
│   │   └── achievements.ts      # University competition honors
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── About.tsx
│   │   ├── ExploreTechnologies.tsx
│   │   ├── CodeAndCompete.tsx
│   │   ├── InnovateAndBuild.tsx
│   │   ├── Hackathons.tsx
│   │   ├── Achievements.tsx
│   │   └── JoinCommunity.tsx
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── package.json
├── tailwind.config.js
└── vite.config.ts
```

---

## 💻 Running the Application Locally

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Start the development server:
   ```bash
   pnpm run dev
   ```

3. Build for production:
   ```bash
   pnpm run build
   ```

4. Preview the production build:
   ```bash
   pnpm run preview
   ```

---

## 🏛️ Institution

**Scope Global Skills University (SGSU)**  
School of Future Skills and Information Technology  
Bhopal, Madhya Pradesh, India.
