/**
 * ============================================================================
 * BINARY BATTLE CLUB — MEMBERSHIP APPLICATION WEBHOOK
 * Google Apps Script Backend for Member Applications
 * 
 * Target Spreadsheet:
 * https://docs.google.com/spreadsheets/d/1WgPR6KQiJzFeAX9KeSP5lwBqmMg8sw_3VJ22eGe00dI/edit?gid=0#gid=0
 * Spreadsheet ID: 1WgPR6KQiJzFeAX9KeSP5lwBqmMg8sw_3VJ22eGe00dI
 * ============================================================================
 */

// Target Spreadsheet ID
var SPREADSHEET_ID = "1WgPR6KQiJzFeAX9KeSP5lwBqmMg8sw_3VJ22eGe00dI";

// Target Tab / Sheet Name (leave empty to automatically use the first active tab)
var TARGET_SHEET_NAME = ""; 

// Optional Shared Secret Token (if configured, incoming requests must include this token)
// Set in Script Properties as 'AUTH_TOKEN', or leave empty to disable
var AUTH_TOKEN = PropertiesService.getScriptProperties().getProperty("AUTH_TOKEN") || "";

/**
 * Standard Default Headers (used if the sheet is completely blank)
 */
var DEFAULT_HEADERS = [
  "Timestamp",
  "Full Name",
  "University Email",
  "Student ID / Enrollment Number",
  "School / Department",
  "Current Semester",
  "Why do you want to join Binary Battle Club?"
];

/**
 * Normalizes text for fuzzy header matching
 */
function normalizeHeader(str) {
  if (!str) return "";
  return str
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, "");
}

/**
 * Matches a header string to one of our standard field keys
 */
function identifyFieldKey(headerText) {
  var norm = normalizeHeader(headerText);
  if (!norm) return null;

  // 1. Timestamp
  if (norm.indexOf("timestamp") !== -1 || norm.indexOf("date") !== -1 || norm.indexOf("time") !== -1 || norm === "submittedat") {
    return "timestamp";
  }

  // 2. Full Name
  if (norm.indexOf("fullname") !== -1 || norm === "name" || norm.indexOf("studentname") !== -1 || norm.indexOf("applicantname") !== -1) {
    return "fullName";
  }

  // 3. University Email
  if (norm.indexOf("email") !== -1 || norm.indexOf("mail") !== -1) {
    return "email";
  }

  // 4. Student ID / Enrollment Number
  if (
    norm.indexOf("studentid") !== -1 ||
    norm.indexOf("enrollment") !== -1 ||
    norm.indexOf("rollno") !== -1 ||
    norm.indexOf("rollnumber") !== -1 ||
    norm.indexOf("enrolment") !== -1 ||
    norm === "id"
  ) {
    return "studentId";
  }

  // 5. School / Department
  if (
    norm.indexOf("department") !== -1 ||
    norm.indexOf("school") !== -1 ||
    norm.indexOf("faculty") !== -1 ||
    norm.indexOf("branch") !== -1 ||
    norm.indexOf("stream") !== -1 ||
    norm.indexOf("course") !== -1
  ) {
    return "schoolDepartment";
  }

  // 6. Current Semester
  if (norm.indexOf("semester") !== -1 || norm.indexOf("sem") !== -1 || norm.indexOf("year") !== -1) {
    return "semester";
  }

  // 7. Why do you want to join Binary Battle Club?
  if (
    norm.indexOf("why") !== -1 ||
    norm.indexOf("reason") !== -1 ||
    norm.indexOf("motivation") !== -1 ||
    norm.indexOf("purpose") !== -1 ||
    norm.indexOf("join") !== -1
  ) {
    return "reasonToJoin";
  }

  return null;
}

/**
 * Gets the active or target sheet safely
 */
function getTargetSheet() {
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

  var sheet;
  if (TARGET_SHEET_NAME && TARGET_SHEET_NAME.trim() !== "") {
    sheet = spreadsheet.getSheetByName(TARGET_SHEET_NAME.trim());
  }
  
  if (!sheet) {
    sheet = spreadsheet.getSheets()[0];
  }

  return sheet;
}

/**
 * Health check & status endpoint (GET)
 */
function doGet(e) {
  try {
    var sheet = getTargetSheet();
    var lastRow = sheet.getLastRow();
    var lastCol = sheet.getLastColumn();

    return ContentService.createTextOutput(JSON.stringify({
      status: "ok",
      service: "Binary Battle Club Join Application Webhook",
      timestamp: new Date().toISOString(),
      sheetName: sheet.getName(),
      totalRows: lastRow,
      totalColumns: lastCol
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Main application submission handler (POST)
 */
function doPost(e) {
  // Concurrency lock to prevent duplicate rows or race conditions
  var lock = LockService.getScriptLock();
  var lockAcquired = false;

  try {
    lockAcquired = lock.tryLock(10000); // 10 second timeout
    if (!lockAcquired) {
      return createJsonResponse({
        status: "error",
        message: "Server is busy processing concurrent submissions. Please try again in a few moments."
      }, 429);
    }

    // 1. Parse incoming payload (supports both application/json and form-urlencoded)
    var data = {};
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (parseErr) {
        // Fallback for form-encoded
        if (e.parameter) {
          data = e.parameter;
        }
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    // 2. Optional Auth Token check
    if (AUTH_TOKEN) {
      var providedToken = data.authToken || (e.parameter && e.parameter.authToken);
      if (providedToken !== AUTH_TOKEN) {
        return createJsonResponse({
          status: "error",
          message: "Unauthorized: Invalid or missing authorization token."
        }, 401);
      }
    }

    // 3. Honeypot Spam Check
    if (data.website || data.botField || data.honeypot) {
      // Silently accept without writing to prevent bot adaptation
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

    var validationErrors = [];

    if (!fullName) {
      validationErrors.push("Full Name is required");
    } else if (fullName.length > 100) {
      validationErrors.push("Full Name must not exceed 100 characters");
    }

    if (!email) {
      validationErrors.push("University Email is required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      validationErrors.push("University Email format is invalid");
    }

    if (!studentId) {
      validationErrors.push("Student ID / Enrollment Number is required");
    }

    if (!schoolDepartment) {
      validationErrors.push("School / Department is required");
    }

    if (!semester) {
      validationErrors.push("Current Semester is required");
    }

    if (!reasonToJoin) {
      validationErrors.push("Why do you want to join Binary Battle Club is required");
    } else if (reasonToJoin.length < 15) {
      validationErrors.push("Motivation response must be at least 15 characters");
    }

    if (validationErrors.length > 0) {
      return createJsonResponse({
        status: "error",
        message: "Validation failed",
        errors: validationErrors
      }, 400);
    }

    // 5. Access target spreadsheet and sheet
    var sheet = getTargetSheet();
    var lastRow = sheet.getLastRow();
    var lastCol = sheet.getLastColumn();

    // 6. Header Inspection & Mapping
    var headerMap = {}; // Maps field key -> column index (1-based)
    var headerNames = [];

    if (lastRow === 0 || lastCol === 0) {
      // Sheet is empty — initialize Row 1 with standard default headers
      sheet.getRange(1, 1, 1, DEFAULT_HEADERS.length).setValues([DEFAULT_HEADERS]);
      sheet.getRange(1, 1, 1, DEFAULT_HEADERS.length).setFontWeight("bold");
      try {
        sheet.setFrozenRows(1);
      } catch (fErr) {}
      
      lastRow = 1;
      lastCol = DEFAULT_HEADERS.length;
      headerNames = DEFAULT_HEADERS;
    } else {
      headerNames = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
    }

    // Map each existing column header to its field key
    for (var colIdx = 0; colIdx < headerNames.length; colIdx++) {
      var hText = headerNames[colIdx];
      var fieldKey = identifyFieldKey(hText);
      if (fieldKey && !headerMap[fieldKey]) {
        headerMap[fieldKey] = colIdx + 1; // 1-based index
      }
    }

    // Verify that all 6 required fields have matching columns in the sheet
    var requiredFieldKeys = [
      { key: "fullName", label: "Full Name" },
      { key: "email", label: "University Email" },
      { key: "studentId", label: "Student ID / Enrollment Number" },
      { key: "schoolDepartment", label: "School / Department" },
      { key: "semester", label: "Current Semester" },
      { key: "reasonToJoin", label: "Why do you want to join Binary Battle Club?" }
    ];

    var missingColumns = [];
    for (var i = 0; i < requiredFieldKeys.length; i++) {
      var req = requiredFieldKeys[i];
      if (!headerMap[req.key]) {
        missingColumns.push(req.label);
      }
    }

    if (missingColumns.length > 0) {
      return createJsonResponse({
        status: "error",
        message: "Missing required spreadsheet column(s): " + missingColumns.join(", ") + ". Please check header row in sheet '" + sheet.getName() + "'.",
        missingColumns: missingColumns,
        detectedHeaders: headerNames
      }, 500);
    }

    // 7. Prepare Row Data matching the exact column order of the sheet
    var newRowValues = new Array(lastCol);
    for (var c = 0; c < lastCol; c++) {
      newRowValues[c] = ""; // default empty
    }

    // Auto-generate timestamp (formatted nicely in ISO and local time)
    var now = new Date();
    var formattedDate = Utilities.formatDate(now, Session.getScriptTimeZone() || "Asia/Kolkata", "yyyy-MM-dd HH:mm:ss");

    if (headerMap["timestamp"]) {
      newRowValues[headerMap["timestamp"] - 1] = formattedDate;
    }

    // Populate the 6 application fields
    newRowValues[headerMap["fullName"] - 1] = fullName;
    newRowValues[headerMap["email"] - 1] = email;
    newRowValues[headerMap["studentId"] - 1] = studentId;
    newRowValues[headerMap["schoolDepartment"] - 1] = schoolDepartment;
    newRowValues[headerMap["semester"] - 1] = semester;
    newRowValues[headerMap["reasonToJoin"] - 1] = reasonToJoin;

    // 8. Append one new row cleanly (no overwrites)
    sheet.appendRow(newRowValues);

    var assignedRowNumber = sheet.getLastRow();

    // 9. Return structured success confirmation
    return createJsonResponse({
      status: "success",
      message: "Application submitted successfully and logged to Google Sheets.",
      timestamp: formattedDate,
      rowNumber: assignedRowNumber,
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
      message: "Server exception while recording application: " + error.toString()
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
