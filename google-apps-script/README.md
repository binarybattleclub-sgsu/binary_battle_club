# Binary Battle Club — Google Apps Script Deployment Guide

This guide explains how to deploy the Google Apps Script backend that connects the **Join Binary Battle Club** membership form to the private Google Spreadsheet.

Target Spreadsheet:
[https://docs.google.com/spreadsheets/d/1WgPR6KQiJzFeAX9KeSP5lwBqmMg8sw_3VJ22eGe00dI/edit?gid=0#gid=0](https://docs.google.com/spreadsheets/d/1WgPR6KQiJzFeAX9KeSP5lwBqmMg8sw_3VJ22eGe00dI/edit?gid=0#gid=0)

---

## Step 1: Open Apps Script from the Spreadsheet

1. Open the target spreadsheet in your browser while signed in to your Google Account:
   `https://docs.google.com/spreadsheets/d/1WgPR6KQiJzFeAX9KeSP5lwBqmMg8sw_3VJ22eGe00dI/edit`
2. In the top menu bar, click **Extensions** > **Apps Script**.
3. A new tab will open with the Google Apps Script editor.
4. Rename the project at the top left from "Untitled project" to **BBC Join Form Webhook**.

---

## Step 2: Paste the Code

1. In the code editor, delete any placeholder code inside `Code.gs`.
2. Copy the entire contents of [`Code.gs`](./Code.gs) and paste it into the editor.
3. Click the **Save project** icon (floppy disk) or press `Ctrl + S` (`Cmd + S` on Mac).

---

## Step 3: Verify or Initialize the Spreadsheet Header Row

In row 1 of your spreadsheet tab (e.g. `Sheet1`), ensure the following 7 column headers are present:

| Column A | Column B | Column C | Column D | Column E | Column F | Column G |
|---|---|---|---|---|---|---|
| **Timestamp** | **Full Name** | **University Email** | **Student ID / Enrollment Number** | **School / Department** | **Current Semester** | **Why do you want to join Binary Battle Club?** |

> **Note:** If the sheet is completely blank, the script will automatically create, format, and freeze these exact headers on the first submission.

---

## Step 4: Deploy as a Web App

1. In the top right corner of the Apps Script editor, click the blue **Deploy** button.
2. Select **New deployment**.
3. Next to "Select type", click the gear icon (⚙️) and select **Web app**.
4. Configure the deployment settings:
   - **Description:** `BBC Membership Webhook v1`
   - **Execute as:** `Me (<your-email>@...)` *(Crucial: runs with your spreadsheet permissions)*
   - **Who has access:** `Anyone` *(Crucial: allows the server-side API to forward submissions)*
5. Click **Deploy**.
6. If prompted, click **Authorize access**, select your Google account, and grant spreadsheet access permissions.
7. Google will display the **Web App URL**:
   ```
   https://script.google.com/macros/s/AKfycb.../exec
   ```
8. **Copy this Web App URL.**

---

## Step 5: Configure the Server Environment Variable

Add the copied URL to your project's `.env` file (and in your hosting provider's dashboard, e.g. Vercel or Netlify environment variables):

```env
GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/AKfycb.../exec
```

---

## Security & Privacy Note
- The Google Spreadsheet remains completely **private**.
- The `GOOGLE_APPS_SCRIPT_URL` is kept **strictly server-side** in your backend environment variables and is never exposed to the frontend browser.
- Submissions are received through the `/api/join` endpoint with rate-limiting, honeypot protection, and server-side validation.
