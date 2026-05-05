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
  sheet.getRange("B2:B21").setHorizontalAlignment("center")
  sheet.getRange("C2:C21").setHorizontalAlignment("center")

  for (let i = 2; i <= 21; i++) {
    sheet.getRange("A" + i).setValue(i - 1);
  }
}

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("Pixel Reveal")
    .addItem("Open Setup", "openSidebar")
    .addItem("Generate Q&A Sheet", "generateQASheet")
    .addToUi();
}