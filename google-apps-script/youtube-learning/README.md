# Binary Battle Club — YouTube Learning Library (Google Apps Script)

This directory contains the production Google Apps Script code for connecting the **YouTube Learning Library** section on the Binary Battle Club website directly to your Google Spreadsheet.

---

## 1. Target Spreadsheet Details

- **Spreadsheet Title:** `Youtube Links and thumbnail`
- **Spreadsheet URL:** [https://docs.google.com/spreadsheets/d/1hXrejoZzSYGoWpzB5SrohZpixQrXke9A9qRbWtYBnZw/edit?usp=sharing](https://docs.google.com/spreadsheets/d/1hXrejoZzSYGoWpzB5SrohZpixQrXke9A9qRbWtYBnZw/edit?usp=sharing)
- **Spreadsheet ID:** `1hXrejoZzSYGoWpzB5SrohZpixQrXke9A9qRbWtYBnZw`
- **Active Tab:** `Sheet1` (gid=0)

---

## 2. Spreadsheet Header Columns

### Existing Minimum Headers
The script works right now with your existing 3-column setup:
1. `DATE OF UPLOAD`
2. `LINK OF YOUTUBE PLAYLIST / VIDEO / SHORTS`
3. `DESCRIPTION`

### Recommended Additional Headers (Optional for Enhanced Features)
To customize individual cards, you can add any of these headers to Row 1 in any order:
- `Title` *(Custom title for the video/playlist/short; falls back to description first line if omitted)*
- `Type` *(video, short, or playlist; auto-detected from URL if omitted)*
- `Thumbnail URL` *(Google Drive share link or direct image link; auto-converts to CDN or YouTube default)*
- `Category` *(Programming, Web Development, AI, DSA, etc.)*
- `Published` *(TRUE / FALSE; defaults to TRUE)*
- `Featured` *(TRUE / FALSE; marks top hero video)*
- `Display Order` *(1, 2, 3...)*

---

## 3. Step-by-Step Deployment Instructions

### Step 1: Open Apps Script in the Spreadsheet
1. Open the spreadsheet:
   [https://docs.google.com/spreadsheets/d/1hXrejoZzSYGoWpzB5SrohZpixQrXke9A9qRbWtYBnZw/edit](https://docs.google.com/spreadsheets/d/1hXrejoZzSYGoWpzB5SrohZpixQrXke9A9qRbWtYBnZw/edit)
2. In the top toolbar, click **Extensions** > **Apps Script**.
3. Rename the project in the upper left: `BBC YouTube Learning Endpoint`.

### Step 2: Paste the Code
1. Replace all default code in `Code.gs` with the contents of [`Code.gs`](./Code.gs).
2. Save the project (`Ctrl + S` or `Cmd + S`).

### Step 3: Deploy as a Web App
1. In the upper-right corner, click **Deploy** > **New deployment**.
2. Click the gear icon (⚙️) next to "Select type" and select **Web app**.
3. Configure the fields:
   - **Description:** `BBC YouTube Learning v1`
   - **Execute as:** `Me (<your-email>)`
   - **Who has access:** `Anyone`
4. Click **Deploy**.
5. When prompted, click **Authorize Access**, choose your Google account, click **Advanced**, and click **Go to BBC YouTube Learning Endpoint (unsafe)**.
6. Copy the **Web App URL**:
   ```
   https://script.google.com/macros/s/AKfycb.../exec
   ```

### Step 4: Configure Environment Variable
In your `.env` file (and in your Vercel Project Settings > Environment Variables):
```env
GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/AKfycb.../exec
```

> **Note:** Even without deploying the Apps Script, the website's Vercel backend and Vite dev server automatically fall back to fetching directly from the public Google Sheets CSV feed, ensuring 100% uptime!
