// Replace with your actual Spreadsheet and Drive Folder IDs
const SPREADSHEET_ID = "1cmp8AiCr_JYLWgxYn5t3hpqPB92qe3jEjlDzo-EStN8";
const SHEET_NAME = "Sheet1";
const DRIVE_FOLDER_ID = "1LnSu_u2t1TAOQYgI_PjWl7fxZ9WwEwkZ";

function doPost(e) {
  try {
    // Parse form data from the POST request
    var params = e.parameter;
    var dateTimeOffence = params.dateTimeOffence || "";
    var location = params.location || "";
    var employeeName = params.employeeName || "";
    var employeeCompany = params.employeeCompany || "";
    var finId = params.finId || "";
    var workActivity = params.workActivity || "";
    var offenceDesc = params.offenceDesc || "";
    var actionType = params.actionType || "";
    var nextOffence = params.nextOffence || "";
    var ackSignature = params.ackSignature || "";       // Data URL from signature pad 1
    var reportBy = params.reportBy || "";
    var designation = params.designation || "";
    var reporterSignature = params.reporterSignature || ""; // Data URL from signature pad 2

    // Append data to Google Sheet
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = ss.getSheetByName(SHEET_NAME);
    sheet.appendRow([
      dateTimeOffence, location, employeeName, employeeCompany, finId,
      workActivity, offenceDesc, actionType, nextOffence, ackSignature,
      reportBy, designation, reporterSignature
    ]);

    // Create a PDF using an HTML template (see next section for pdfTemplate.html)
    var template = HtmlService.createTemplateFromFile('pdfTemplate');
    template.dateTimeOffence = dateTimeOffence;
    template.location = location;
    template.employeeName = employeeName;
    template.employeeCompany = employeeCompany;
    template.finId = finId;
    template.workActivity = workActivity;
    template.offenceDesc = offenceDesc;
    template.actionType = actionType;
    template.nextOffence = nextOffence;
    template.ackSignature = ackSignature;
    template.reportBy = reportBy;
    template.designation = designation;
    template.reporterSignature = reporterSignature;
    var htmlOutput = template.evaluate().getContent();

    // Convert the HTML output to PDF
    var pdfBlob = Utilities.newBlob(htmlOutput, 'text/html')
                           .getAs('application/pdf')
                           .setName('WarningLetter_' + employeeName + '.pdf');

    // Save the PDF into the specified Google Drive folder
    var folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
    folder.createFile(pdfBlob);

    return ContentService.createTextOutput("Success");
  } catch (err) {
    Logger.log(err);
    return ContentService.createTextOutput("Error: " + err);
  }
}

