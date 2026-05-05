# Pixel Reveal

A Google Sheets tool for teachers. Upload an image, crop it, and generate a 20-stage pixel reveal activity — students answer questions to progressively uncover the image.

## Getting started

1. Go to this Google Sheet: [Pixel Reveal Template](https://docs.google.com/spreadsheets/d/1tYfM9Qz2im-AeAO6wudi58peGd4trimVd8V09kcBvFc/edit?usp=sharing)
2. Click **File > Make a Copy** and save it to your Drive
3. Approve the popup about the unreviewed script
4. The **Pixel Reveal** menu will appear at the top — you're ready to go

## How to use it

### Step 1 — Set your questions
**Pixel Reveal > Generate Q&A Sheet**

This creates a Q&A tab pre-filled with 20 example algebra questions. Replace column B with your questions and column C with the answers. Don't rename the Q&A sheet.

### Step 2 — Upload your image
**Pixel Reveal > Open Setup**

A sidebar opens. Pick your grid size, upload an image, crop it, and click **Insert Image**. Wait a minute or two before closing the sidebar.

### Step 3 — Share with students
**Pixel Reveal > Export Student Copy**

Creates a new Google Sheet with just the activity — no script, no answers. A shareable link is shown in a popup.

## Grid size options

| Option | Tiles | Notes |
|---|---|---|
| 20x20 w/ outline | 400 | Recommended for most images |
| 40x40 w/ outline | 1600 | More detail, slower to generate |
| 80x80 w/ outline | 6400 | Very fine grid |
| 20x20 no outline | 400 | Cleaner look without tile borders |
| 40x40 no outline | 1600 | |
| 80x80 no outline | 6400 | |

## Notes and limitations

- Do not rename the **Activity** or **Q&A** sheets
- Only 20 questions are supported for now — open a GitHub issue if you need a different number
- Images are generated at up to 1280×720 resolution
- 21 total stages are generated: one fully covered + 20 progressive reveals

---

## For contributors

### Project structure

```
appscript/Code.gs   — Google Apps Script (bound to the Sheets template)
app.js              — Frontend logic (image upload, crop, tile generation)
index.html          — Sidebar UI, hosted on GitHub Pages
style.css           — Sidebar styles
```

### How it works technically

The sidebar is an iframe loading the GitHub Pages site (`index.html`). When the teacher clicks Insert Image, `app.js` uses the [Cropper.js](https://github.com/fengyuanchen/cropperjs) library to crop the uploaded image, then generates 21 canvas frames — one blank and 20 progressively revealing tiles chosen in a shuffled order. Each frame is exported as a base64 PNG data URL.

The frames are sent from the iframe to the Apps Script via `window.parent.postMessage`. The Apps Script listener (`receiveMessage`) writes each frame as a cell image into hidden columns of the Activity sheet.

When exporting a student copy, the script copies the Q&A answers into hidden cells of the Activity sheet, then creates a new standalone spreadsheet (no bound script) containing only the Activity sheet, clears the answer cells, and sets sharing to anyone with the link.

### Running locally

The sidebar is a static site — just open `index.html` in a browser. The `postMessage` to Apps Script won't work outside of Sheets, but the image upload, crop, and tile generation all work for testing.

### Deploying changes

Push to `main` — GitHub Pages serves the site automatically. The Apps Script in the template sheet needs to be updated manually via **Extensions > Apps Script** if `Code.gs` changes.