# Binary Battle Club — The Project Lab Data & Asset Architecture

This directory contains the verified data layer and asset documentation for **The Project Lab** (Create & Showcase) at Binary Battle Club.

## 1. Verified Summary Metrics
- **Original Submissions:** 12 spreadsheet rows parsed from `Project Detail Binary battle club (Responses).xlsx`.
- **Unique Projects:** Exactly **11 projects** after merging the two collaborative submissions for SpendWise.
- **Student Builder Profiles:** Exactly **9 student developers**.
- **Collaborative Initiatives:** 1 confirmed collaborative system (SpendWise).
- **Core Technology Domains:** 3 domains (AI Projects, Web Development, Cybersecurity).

## 2. Asset Verification & Mapping
Extracted and verified from `Project Of Binary Battle Club.pptx` (25 media assets total):
- **Matched Artwork (9 items):**
  - `spendwise.png` (Slide 16 / `image17.png`) -> SpendWise (Raushan Kumar & Soumya Yadav)
  - `cybersafe_portal.jpg` (Slide 19 / `image20.jpg`) -> CyberSafe Portal (Sakshi Ahirwar)
  - `pixelme.png` (Slide 3 / `image4.png`) -> PixelMe (Syed Faizan Ali)
  - `particles_ai.png` (Slide 17 / `image18.png`) -> Particles AI (Syed Faizan Ali)
  - `smart_notice_board.png` (Slide 13 / `image14.png`) -> Smart Notice Board System (Sakshi Ahirwar)
  - `dimpy_cosmos.png` (Slide 2 / `image3.png`) -> Cosmos (Dimpy Rai)
  - `music_royalty_vault.png` (Slide 10 / `image11.png`) -> Music Royalty Vault (Ashu Patel)
  - `binbrain_ai.png` (Slide 5 / `image6.png`) -> BinBrain AI (Ashu Patel)
  - `drishti_ai.jpeg` (Slide 21 / `image22.jpeg`) -> Drishti AI (Juhi Pawar / Drishti Team)
- **Verified Live Application Captures (2 items):**
  - `pmi_ai.png` -> High-resolution live capture from verified deployment `https://pmi-ai.vercel.app/` (Mohammad Nomaan)
  - `student_management.png` -> High-resolution live capture from verified deployment `https://8756756771NY.pythonanywhere.com/` (Nilesh Kumar)
- **Archived Unmatched Assets (14 items):**
  - Stored in `/images/project_lab/unmatched_from_ppt/` for safe keeping. Not published without verified student ownership.
- **Club Branding Assets (2 items):**
  - `bbc_logo.jpeg` & `sgsu_banner.jpeg` stored in `/images/project_lab/branding/`.

## 3. Collaboration & Attribution Rules
- **SpendWise**: Merged project record linked to both `raushan-kumar` and `soumya-yadav`. Both builders are prominently credited across the carousel, main archive, and detail modal. The project appears in both of their dedicated portfolio views.
- **Drishti AI**: Submitted by Juhi Pawar; original artwork attributed to "Drishti Team". Preserved with an explicit attribution note on the project record.

## 4. Source Files Inventory
- `project-data.json`: Structured source of truth for all projects and student profiles.
- `ppt-asset-catalog.csv`: Detailed catalog of all 25 media assets extracted from the presentation.
- `projectLabData.ts`: Strongly-typed TypeScript interfaces and query functions.
