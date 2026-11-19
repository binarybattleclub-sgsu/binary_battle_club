# Binary Battle Club — Google Apps Script Deployment Guide (Applied Members Tab)

This guide walks you through deploying the Google Apps Script backend to connect the **Join Binary Battle Club** membership form directly to the **Applied Members** tab of your Google Spreadsheet.

### Target Spreadsheet Details
- **Google Sheets URL:** [https://docs.google.com/spreadsheets/d/1WgPR6KQiJzFeAX9KeSP5lwBqmMg8sw_3VJ22eGe00dI/edit?usp=sharing](https://docs.google.com/spreadsheets/d/1WgPR6KQiJzFeAX9KeSP5lwBqmMg8sw_3VJ22eGe00dI/edit?usp=sharing)
- **Spreadsheet ID:** `1WgPR6KQiJzFeAX9KeSP5lwBqmMg8sw_3VJ22eGe00dI`
- **Target Worksheet / Tab:** `Applied Members` *(Strictly target this tab; Sheet2 is untouched)*

---

## Column Mapping Reference

The script inspects Row 10 of the `Applied Members` tab and writes into the pre-designed table starting at **Row 11**:

| Column | Header | Form Field Mapped | Sample Value |
|:---:|---|---|---|
| **B** | `Sno.` | Serial Number (Auto-incremented) | `1` |
| **C** | `Name` | 1. Full Name | `Aarav Sharma` |
| **D** | `University Email` | 2. University Email | `student@sgsu.edu.in` |
| **E** | `Enrollment Number` | 3. Student ID / Enrollment Number | `SGSU-2024-CSE-042` |
| **F** | `Department` | 4. School / Department | `School of Future Skills & IT` |
| **G** | `Current Semester` | 5. Current Semester | `Semester 3 / 2nd Year` |
| **H** | `Application Date` | Submission Timestamp | `2026-11-20 00:05:00` |
| **I** | `Application Status` | Default Status | `Pending` |
| **J** | `Notes` | 6. Why do you want to join BBC? | Motivation response |

*All summary metrics (Total Applications, Approval Progress, Pending / Under Review) in Rows 1–8 update automatically from these entries!*

---

## Step-by-Step Deployment Instructions

### Step 1: Open Apps Script from the Spreadsheet
1. Open your target spreadsheet in Google Chrome:
   [https://docs.google.com/spreadsheets/d/1WgPR6KQiJzFeAX9KeSP5lwBqmMg8sw_3VJ22eGe00dI/edit](https://docs.google.com/spreadsheets/d/1WgPR6KQiJzFeAX9KeSP5lwBqmMg8sw_3VJ22eGe00dI/edit)
2. In the top menu, click **Extensions** > **Apps Script**.
3. Name your project **BBC Join Form Webhook**.

### Step 2: Paste the Integration Script
1. Delete any boilerplate code inside `Code.gs`.
2. Copy the entire contents of [`Code.gs`](./Code.gs) and paste it into the editor.
3. Save the project (`Ctrl + S` or `Cmd + S`).

### Step 3: Deploy as a Web App
1. In the top-right corner of the Apps Script editor, click **Deploy** > **New deployment**.
2. Click the gear icon (⚙️) next to "Select type" and select **Web app**.
3. Set the fields:
   - **Description:** `BBC Applied Members Webhook v1`
   - **Execute as:** `Me (<your-email>@...)` *(Crucial: runs with your spreadsheet write permissions)*
   - **Who has access:** `Anyone` *(Crucial: allows your server-side API to forward submissions)*
4. Click **Deploy**.
5. Grant the necessary Google Spreadsheet authorizations when prompted.
6. Copy the generated **Web App URL**:
   ```
   https://script.google.com/macros/s/AKfycb.../exec
   ```

### Step 4: Add URL to Server Environment Variables
In your project's `.env` file (and in your hosting provider's dashboard, e.g. Vercel or Netlify environment variables):
```env
GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/AKfycb.../exec
```

---

## Security & Architecture Highlights
- **Private Data:** The Google Spreadsheet stays private; only owners have access.
- **Hidden Endpoint:** The Apps Script URL is kept strictly in server-side environment variables and is never revealed to the browser.
- **Spam Defense:** The form includes a hidden honeypot field and sliding-window IP rate limiting (5 submissions per 15 minutes) before reaching Google Sheets.
- **Formatting Preservation:** The script inserts records directly into the table cells in columns B through J, preserving the top dashboard metrics and bottom status tables without disruption.
