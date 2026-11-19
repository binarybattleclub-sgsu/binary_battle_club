/**
 * ============================================================================
 * BINARY BATTLE CLUB — MEMBERSHIP APPLICATION WEBHOOK
 * Google Apps Script Backend for Member Applications
 * 
 * Target Spreadsheet:
 * https://docs.google.com/spreadsheets/d/1WgPR6KQiJzFeAX9KeSP5lwBqmMg8sw_3VJ22eGe00dI/edit?usp=sharing
 * Spreadsheet ID: 1WgPR6KQiJzFeAX9KeSP5lwBqmMg8sw_3VJ22eGe00dI
 * Target Worksheet: Applied Members
 * ============================================================================
 */

// Target Spreadsheet ID
var SPREADSHEET_ID = "1WgPR6KQiJzFeAX9KeSP5lwBqmMg8sw_3VJ22eGe00dI";

// Target Tab / Worksheet Name (STRICT: Must be "Applied Members", never Sheet2)
var TARGET_TAB_NAME = "Applied Members";

// Optional Shared Secret Token (set in Script Properties as 'AUTH_TOKEN' if needed)
var AUTH_TOKEN = PropertiesService.getScriptProperties().getProperty("AUTH_TOKEN") || "";

/**
 * Normalizes text for header inspection
 */
function normalizeText(str) {
  if (!str) return "";
  return str.toString().toLowerCase().trim().replace(/[^a-z0-9]/g, "");
}

/**
 * Gets the target spreadsheet and the exact "Applied Members" tab
 */
function getAppliedMembersSheet() {
  var spreadsheet;
  try {
    if (SPREADSHEET_ID && SPREADSHEET_ID.trim() !== "") {
      spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID.trim());
    } else {
      spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    }
  } catch (e) {
    spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  }

  if (!spreadsheet) {
    throw new Error("Could not access target spreadsheet. Ensure SPREADSHEET_ID is valid and permissions are granted.");
  }

  var sheet = spreadsheet.getSheetByName(TARGET_TAB_NAME);
  if (!sheet) {
    throw new Error("Target worksheet '" + TARGET_TAB_NAME + "' not found. Do NOT write into Sheet2. Please verify tab name.");
  }

  return sheet;
}

/**
 * Health check & status endpoint (GET)
 */
function doGet(e) {
  try {
    var sheet = getAppliedMembersSheet();
    var lastRow = sheet.getLastRow();
    var lastCol = sheet.getLastColumn();

    // Inspect table
    var tableInfo = findMemberTableBounds(sheet);

    return ContentService.createTextOutput(JSON.stringify({
      status: "ok",
      service: "Binary Battle Club Join Application Webhook",
      targetTab: TARGET_TAB_NAME,
      spreadsheetId: SPREADSHEET_ID,
      headerRow: tableInfo.headerRow,
      nextAvailableRow: tableInfo.targetRow,
      existingMembersCount: tableInfo.existingCount,
      timestamp: new Date().toISOString()
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Scans the Applied Members sheet to identify:
 * 1. The exact table header row (e.g. Row 10: Sno., Name, University Email, Enrollment Number...)
 * 2. The exact column indices for each field
 * 3. The next available row in the table without breaking the dashboard or summary table
 */
function findMemberTableBounds(sheet) {
  var maxScanRows = Math.min(20, sheet.getLastRow());
  var maxCols = Math.min(15, sheet.getLastColumn());

  var headerRow = -1;
  var colMap = {};

  // Scan rows 1 through 15 to find the table header row
  for (var r = 1; r <= maxScanRows; r++) {
    var rowVals = sheet.getRange(r, 1, 1, maxCols).getValues()[0];
    var tempMap = {};

    for (var c = 0; c < rowVals.length; c++) {
      var norm = normalizeText(rowVals[c]);
      if (!norm) continue;

      if ((norm === "sno" || norm === "sno." || norm === "srno" || norm === "no") && !tempMap.sno) {
        tempMap.sno = c + 1;
      } else if (norm === "name" && !tempMap.name) {
        tempMap.name = c + 1;
      } else if (norm.indexOf("email") !== -1 && !tempMap.email) {
        tempMap.email = c + 1;
      } else if ((norm.indexOf("enrollment") !== -1 || norm.indexOf("studentid") !== -1) && !tempMap.studentId) {
        tempMap.studentId = c + 1;
      } else if ((norm.indexOf("department") !== -1 || norm.indexOf("school") !== -1) && !tempMap.department) {
        tempMap.department = c + 1;
      } else if ((norm.indexOf("semester") !== -1 || norm.indexOf("sem") !== -1) && !tempMap.semester) {
        tempMap.semester = c + 1;
      } else if ((norm.indexOf("date") !== -1 || norm.indexOf("time") !== -1) && !tempMap.date) {
        tempMap.date = c + 1;
      } else if (norm.indexOf("status") !== -1 && !tempMap.status && c < 10) {
        tempMap.status = c + 1;
      } else if ((norm.indexOf("notes") !== -1 || norm.indexOf("why") !== -1 || norm.indexOf("reason") !== -1) && !tempMap.notes && c < 10) {
        tempMap.notes = c + 1;
      }
    }

    // Header row found if it contains Name, Email, and Enrollment Number
    if (tempMap.name && tempMap.email && tempMap.studentId) {
      headerRow = r;
      colMap = tempMap;
      break;
    }
  }

  // Fallback defaults if layout was completely unaltered (Col B=2 to Col J=10)
  if (headerRow === -1) {
    headerRow = 10;
    colMap = {
      sno: 2,
      name: 3,
      email: 4,
      studentId: 5,
      department: 6,
      semester: 7,
      date: 8,
      status: 9,
      notes: 10
    };
  }

  // Find next available row in the table starting right after headerRow
  var totalRows = sheet.getMaxRows();
  var targetRow = -1;
  var existingCount = 0;
  var summaryBlockRow = -1;

  for (var checkRow = headerRow + 1; checkRow <= totalRows; checkRow++) {
    var nameVal = (sheet.getRange(checkRow, colMap.name || 3).getValue() || "").toString().trim();
    
    // Check if we hit the summary breakdown table in column L (Col 12)
    var colLVal = "";
    try {
      colLVal = (sheet.getRange(checkRow, 12).getValue() || "").toString().trim().toLowerCase();
    } catch (e) {}

    if (colLVal === "status" || colLVal === "approved" || colLVal === "pending") {
      summaryBlockRow = checkRow;
    }

    if (nameVal !== "") {
      existingCount++;
    } else {
      // First empty row found
      if (targetRow === -1) {
        targetRow = checkRow;
      }
    }

    // Stop searching once we've passed beyond reasonable bounds
    if (summaryBlockRow !== -1 && targetRow !== -1) {
      break;
    }
  }

  if (targetRow === -1) {
    targetRow = headerRow + existingCount + 1;
  }

  return {
    headerRow: headerRow,
    colMap: colMap,
    targetRow: targetRow,
    existingCount: existingCount,
    summaryBlockRow: summaryBlockRow
  };
}

/**
 * Main application submission handler (POST)
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  var lockAcquired = false;

  try {
    lockAcquired = lock.tryLock(10000); // 10s concurrency lock
    if (!lockAcquired) {
      return createJsonResponse({
        status: "error",
        message: "Server is currently processing concurrent applications. Please retry in a few seconds."
      }, 429);
    }

    // 1. Parse incoming application data
    var data = {};
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (parseErr) {
        if (e.parameter) data = e.parameter;
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    // 2. Auth token check (if configured)
    if (AUTH_TOKEN) {
      var providedToken = data.authToken || (e.parameter && e.parameter.authToken);
      if (providedToken !== AUTH_TOKEN) {
        return createJsonResponse({
          status: "error",
          message: "Unauthorized: Invalid authorization token."
        }, 401);
      }
    }

    // 3. Honeypot check (anti-spam)
    if (data.website || data.botField || data.honeypot) {
      return createJsonResponse({
        status: "success",
        message: "Application processed successfully."
      });
    }

    // 4. Validate all 6 required fields
    var fullName = (data.fullName || "").toString().trim();
    var email = (data.email || "").toString().trim();
    var studentId = (data.studentId || "").toString().trim();
    var schoolDepartment = (data.schoolDepartment || "").toString().trim();
    var semester = (data.semester || "").toString().trim();
    var reasonToJoin = (data.reasonToJoin || "").toString().trim();

    var errors = [];

    if (!fullName) errors.push("Full Name is required");
    if (!email) {
      errors.push("University Email is required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push("University Email format is invalid");
    }
    if (!studentId) errors.push("Student ID / Enrollment Number is required");
    if (!schoolDepartment) errors.push("School / Department is required");
    if (!semester) errors.push("Current Semester is required");
    if (!reasonToJoin) {
      errors.push("Why do you want to join Binary Battle Club is required");
    } else if (reasonToJoin.length < 15) {
      errors.push("Motivation response must be at least 15 characters");
    }

    if (errors.length > 0) {
      return createJsonResponse({
        status: "error",
        message: "Validation failed: " + errors.join("; "),
        errors: errors
      }, 400);
    }

    // 5. Access the target "Applied Members" sheet
    var sheet = getAppliedMembersSheet();

    // 6. Inspect table bounds and find exact insertion row
    var table = findMemberTableBounds(sheet);
    var colMap = table.colMap;
    var targetRow = table.targetRow;
    var newSno = table.existingCount + 1;

    // If targetRow has reached or exceeded the summary block at row 26, insert a row to preserve layout
    if (table.summaryBlockRow !== -1 && targetRow >= table.summaryBlockRow) {
      sheet.insertRowBefore(table.summaryBlockRow);
      targetRow = table.summaryBlockRow;
    }

    // 7. Format current submission date & time
    var now = new Date();
    var formattedDate = Utilities.formatDate(now, Session.getScriptTimeZone() || "Asia/Kolkata", "yyyy-MM-dd HH:mm:ss");

    // 8. Write values into the exact columns of the member table (Columns B through J)
    // Col B: Sno.
    // Col C: Name
    // Col D: University Email
    // Col E: Enrollment Number
    // Col F: Department
    // Col G: Current Semester
    // Col H: Application Date
    // Col I: Application Status (Pending)
    // Col J: Notes (Why do you want to join...)
    if (colMap.sno) sheet.getRange(targetRow, colMap.sno).setValue(newSno);
    if (colMap.name) sheet.getRange(targetRow, colMap.name).setValue(fullName);
    if (colMap.email) sheet.getRange(targetRow, colMap.email).setValue(email);
    if (colMap.studentId) sheet.getRange(targetRow, colMap.studentId).setValue(studentId);
    if (colMap.department) sheet.getRange(targetRow, colMap.department).setValue(schoolDepartment);
    if (colMap.semester) sheet.getRange(targetRow, colMap.semester).setValue(semester);
    if (colMap.date) sheet.getRange(targetRow, colMap.date).setValue(formattedDate);
    if (colMap.status) sheet.getRange(targetRow, colMap.status).setValue("Pending");
    if (colMap.notes) sheet.getRange(targetRow, colMap.notes).setValue(reasonToJoin);

    // Apply clean text wrapping and vertical alignment to the new row
    try {
      var rowRange = sheet.getRange(targetRow, 2, 1, 9);
      rowRange.setVerticalAlignment("middle");
      if (colMap.notes) {
        sheet.getRange(targetRow, colMap.notes).setWrap(true);
      }
    } catch (styleErr) {}

    // Flush spreadsheet changes immediately
    SpreadsheetApp.flush();

    // 9. Return structured success response
    return createJsonResponse({
      status: "success",
      message: "Application successfully added to 'Applied Members' tab.",
      sheetName: TARGET_TAB_NAME,
      rowNumber: targetRow,
      sno: newSno,
      timestamp: formattedDate,
      applicant: {
        fullName: fullName,
        email: email,
        studentId: studentId,
        schoolDepartment: schoolDepartment,
        semester: semester
      }
    });

  } catch (error) {
    return createJsonResponse({
      status: "error",
      message: "Exception while saving to Applied Members: " + error.toString()
    }, 500);
  } finally {
    if (lockAcquired) {
      lock.releaseLock();
    }
  }
}

/**
 * Creates a JSON response with proper CORS headers
 */
function createJsonResponse(payload, statusCode) {
  var output = ContentService.createTextOutput(JSON.stringify(payload));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}
