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
  Logger.log(data)
  const base64   = Utilities.base64Encode(blob.getBytes());
  const dataUrl  = "data:" + blob.getContentType() + ";base64," + base64;

  const cellImage = SpreadsheetApp.newCellImage()
    .setSourceUrl(data.stages[0])
    .build();
 
  // Drop it into A1 of the active sheet
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.getRange("A1").setValue(cellImage);
}

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("Pixel Reveal")
    .addItem("Open Setup", "openSidebar")
    .addToUi();
}