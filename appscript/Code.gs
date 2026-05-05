function openSidebar() {
  var html = HtmlService.createHtmlOutput(
    '<iframe src="https://wsthilaire.github.io/SheetsPixelArtReveal/?v=' + Date.now() + '"' +
    'width="100%" height="800px"></iframe>' +
    '<script>' +
    'window.addEventListener("message", function(e) {' +
    '  google.script.run.receiveMessage(e.data);' +
    '});' +
    '</script>'
  );
  SpreadsheetApp.getUi().showSidebar(html);
}

function receiveMessage(data) {
  //var sheet = SpreadsheetApp.getActiveSheet();
  Logger.log(data);
  Logger.log(data.stages[1]);
  Logger.log(data.stages.length);

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Activity");
  if(sheet) {
    ss.setActiveSheet(sheet);
  };

  for (let stage = 0; stage < data.stages.length; stage++){
    const cellImage = SpreadsheetApp.newCellImage()
      .setSourceUrl(data.stages[stage])
      .build();
    
    // Drop it into Z100 of the active sheet
    ss.getRange("Z"+(stage+100)).setValue(cellImage);
    
  }
}

function generateQASheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const existing = ss.getSheetByName("Q&A");
  if (existing) {
    existing.showSheet();
    SpreadsheetApp.getUi().alert("Q&A sheet already exists — it has been unhidden.");
    return;
  }
  const sheet = ss.insertSheet("Q&A");

  sheet.getRange("A1").setValue("Question #");
  sheet.getRange("B1").setValue("Question");
  sheet.getRange("C1").setValue("Answer");
  sheet.getRange("D2").setValue("Instructions: Set the questions column to the questions you want on the Activity"+
    ". Set the answers in the answers column. Once those are set you can use the Pixel Reveal tab at the top to "+
    "'Open Setup' and then select your settings, upload the image, and generate. Allow a few minutes after clicking "+
    "insert image before you close the application window or else it might not work. Then select in the Pixel Reveal tab"+
    " Copy Q&A to Activity, this will let you demo the activity before you export, just delete the answers to see how it works "+
    "then click the Export student copy button. This will create a link to share.");
  sheet.getRange("D1").setValue("These are example questions and answers");
  sheet.getRange("D2:G15").merge();
  sheet.getRange("D2:G15").setWrap(true);
  sheet.getRange("D2:G15").setVerticalAlignment("top");
  sheet.getRange("A1:C1").setFontWeight("bold");
  sheet.getRange("D1").setFontWeight("italic");
  sheet.setColumnWidth(1, 80);
  sheet.setColumnWidth(2, 300);
  sheet.setColumnWidth(3, 300);
  sheet.getRange("A2:A21").setHorizontalAlignment("left")
  sheet.getRange("B1:B21").setHorizontalAlignment("center")
  sheet.getRange("C1:C21").setHorizontalAlignment("center")

  const qa = [
    ["6n + 2n = 32", 4],
    ["3x + x = 8", 2],
    ["2(x + 3) = 18", 6],
    ["5x - 2x = 18", 6],
    ["5x - x = 32", 8],
    ["4x - 3x = 1", 1],
    ["4(x - 1) = 20", 6],
    ["10x - x = 81", 9],
    ["3x + 2x = 25", 5],
    ["2(x + 4) = 24", 8],
    ["5x - 2x = 9", 3],
    ["7(x - 2) = 35", 7],
    ["2(x + 2) = 12", 4],
    ["3(x + 1) = 6", 1],
    ["10x - 3x = 49", 7],
    ["2x + x = 18", 6],
    ["2(x + 12) = 42", 9],
    ["6x - 2x = 8", 2],
    ["x + x + x = 6", 2],
    ["2(x + 5) = 20", 5],
  ];

  for (let i = 0; i < qa.length; i++) {
    sheet.getRange("A" + (i + 2)).setValue(i + 1);
    sheet.getRange("B" + (i + 2)).setValue(qa[i][0]);
    sheet.getRange("C" + (i + 2)).setValue(qa[i][1]);
  }
}

//This cleans up, hides the answers, hides the ugly rows, makes everything dissapear
function cleanUp(){
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const activity = ss.getSheetByName("Activity");
  ss.setActiveSheet(activity);
  activity.hideColumns(22,6);
}

function copyAnswers(){
  //This copies the QA questions over to the sheet hidden cells
  var ssQA = SpreadsheetApp.getActiveSpreadsheet();
  var sheetAct = ssQA.getSheetByName("Activity");
  var source = ssQA.getSheetByName("Q&A");
  if(!source){
    SpreadsheetApp.getUi().alert("No Q&A sheet found. Use Pixel Reveal > Generate Q&A Sheet to set up your questions and answers first.");
    return;
  };
  var sourceRange = source.getRange("B2:C21");
  var destRange = sheetAct.getRange("W101");
  sourceRange.copyTo(destRange);
  sourceRange = source.getRange("B2:C11");
  destRange = sheetAct.getRange("B5");
  sourceRange.copyTo(destRange, {contentsOnly: true});
  sourceRange = source.getRange("B12:C21");
  destRange = sheetAct.getRange("N5");
  sourceRange.copyTo(destRange, {contentsOnly: true});
}

function exportStudentCopy() {
  copyAnswers();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const activity = ss.getSheetByName("Activity");
  if (!activity) {
    SpreadsheetApp.getUi().alert("No Activity sheet found. Please don't rename the Activity sheet, if you did switch it back to 'Activity' and it should work.");
    return;
  }
  const studentSS = SpreadsheetApp.create(ss.getName() + " - Student Copy");
  activity.copyTo(studentSS).setName("Activity");
  studentSS.deleteSheet(studentSS.getSheets()[0]);
  const studentActivity = studentSS.getSheetByName("Activity");
  studentActivity.getRange("C5:C14").setValue("");
  studentActivity.getRange("O5:O14").setValue("");
  DriveApp.getFileById(studentSS.getId()).setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.EDIT);
  const url = studentSS.getUrl();
  SpreadsheetApp.getUi().alert("Student copy created! Share this link:\n\n" + url);
}

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("Pixel Reveal")
    .addItem("Open Setup", "openSidebar")
    .addItem("Generate Q&A Sheet", "generateQASheet")
    .addItem("Copy Q&A to Activity", "copyAnswers")
    .addItem("Export Student Copy", "exportStudentCopy")
    .addToUi();
}