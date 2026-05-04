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

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("Pixel Reveal")
    .addItem("Open Setup", "openSidebar")
    .addToUi();
}