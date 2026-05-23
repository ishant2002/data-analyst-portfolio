const SHEET_NAME = "Leads";

function setup() {
  const sheet = getLeadsSheet_();
  return `Ready. Leads will be saved in sheet: ${sheet.getName()}`;
}

function doGet() {
  const sheet = getLeadsSheet_();

  return ContentService
    .createTextOutput(JSON.stringify({
      ok: true,
      message: "Lead capture endpoint is working.",
      sheet: sheet.getName()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const sheet = getLeadsSheet_();
  const data = e.parameter || {};

  sheet.appendRow([
    new Date(),
    data.name || "",
    data.email || "",
    data.project_type || "",
    data.message || "",
    data.source_page || "",
    data.submitted_at || ""
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getLeadsSheet_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Timestamp",
      "Name",
      "Email",
      "Project Type",
      "Message",
      "Source Page",
      "Submitted At"
    ]);
  }

  return sheet;
}
