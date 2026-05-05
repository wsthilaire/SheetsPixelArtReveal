function openSidebar() {
  var html = HtmlService.createHtmlOutput(
    '<iframe src="https://wsthilaire.github.io/SheetsPixelArtReveal/" ' +
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

  for (let stage = 0; stage < data.stages.length; stage++){
    const cellImage = SpreadsheetApp.newCellImage()
      .setSourceUrl(data.stages[stage])
      .build();
    
    // Drop it into A1 of the active sheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    sheet.getRange("Z"+(stage+100)).setValue(cellImage);
  }
}

function generateQASheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.insertSheet("Q&A");

  sheet.getRange("A1").setValue("Question #");
  sheet.getRange("B1").setValue("Question");
  sheet.getRange("C1").setValue("Answer");

  sheet.getRange("A1:C1").setFontWeight("bold");
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
    ["5x − 2x = 18", 6],
    ["5x − x = 32", 8],
    ["4x − 3x = 1", 1],
    ["4(x − 1) = 20", 6],
    ["10x − x = 81", 9],
    ["3x + 2x = 25", 5],
    ["2(x + 4) = 24", 8],
    ["5x − 2x = 9", 3],
    ["7(x − 2) = 35", 7],
    ["2(x + 2) = 12", 4],
    ["3(x + 1) = 6", 1],
    ["10x − 3x = 49", 7],
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

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("Pixel Reveal")
    .addItem("Open Setup", "openSidebar")
    .addItem("Generate Q&A Sheet", "generateQASheet")
    .addToUi();
}