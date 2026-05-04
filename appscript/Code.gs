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
  var sheet = SpreadsheetApp.getActiveSheet();
  
  var image = SpreadsheetApp.newCellImage()
    .setSourceUrl(data.stages[0])
    .setAltTextTitle('Stage 1')
    .toBuilder()
    .build();

  sheet.getRange('A1').setValue(image);
}

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("Pixel Reveal")
    .addItem("Open Setup", "openSidebar")
    .addToUi();
}