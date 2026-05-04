function openSidebar() {
  var html = HtmlService.createHtmlOutput(
    '<iframe src="https://wsthilaire.github.io/SheetsPixelArtReveal/" ' +
    'width="100%" height="400px"></iframe>' +
    '<script>' +
    'window.addEventListener("message", function(e) {' +
    '  google.script.run.receiveMessage(e.data);' +
    '});' +
    '</script>'
  );
  SpreadsheetApp.getUi().showSidebar(html);
}

function receiveMessage(data) {
  Logger.log(JSON.stringify(data));
  SpreadsheetApp.getActiveSheet()
    .getRange("A1")
    .setValue("Bridge works: " + data.test);
}

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("Pixel Reveal")
    .addItem("Open Setup", "openSidebar")
    .addToUi();
}