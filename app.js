

const fileInput = document.getElementById('file-input');
const uploadZone = document.getElementById('upload-zone');
const generateBtn = document.getElementById('generate-btn');
const resetBtn = document.getElementById('reset-btn');
const cropPlaceholder = document.getElementById('crop-placeholder');
const cropImg = document.getElementById('crop-img');
const statusEl = document.getElementById('status');
const statusText = document.getElementById('status-text');

let cropper = null;
let loadedImage = false;

uploadZone.addEventListener('dragover', e => {
    e.preventDefault();
    uploadZone.classList.add('drag-over');
});
uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('drag-over'));
uploadZone.addEventListener('drop', e => {
    e.preventDefault();
    uploadZone.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) loadImage(file);
});

fileInput.addEventListener('change', () => {
    if (fileInput.files[0]) loadImage(fileInput.files[0]);
});

function loadImage(file) {
    const reader = new FileReader();
    reader.onload = e => {
        cropImg.onload = () => {
            cropPlaceholder.style.display = 'none';
            cropImg.style.display = 'block';
            generateBtn.disabled = false;
            resetBtn.disabled = false;
            cropper = new Cropper(cropImg,{
                viewMode: 1
            });
            setStatus('ready', 'Image loaded — ready to generate');
        };
        cropImg.src = e.target.result;
        loadedImage = true;
    };
    reader.readAsDataURL(file);
}

//reset button
resetBtn.addEventListener('click', () => {
    cropper.destroy();
    cropper = null;
    loadedImage = false;
    cropImg.style.display = 'none';
    cropPlaceholder.style.display = 'flex';
    generateBtn.disabled = true;
    resetBtn.disabled = true;
    fileInput.value = '';
    setStatus('', 'Waiting for image...');
});

generateBtn.addEventListener('click', () => {
    if (!loadedImage) return;
    setStatus('working', 'Generating 20 stages...');
    const croppedCanvas = cropper.getCroppedCanvas();
    const canvas = document.createElement('canvas');
    const scale = Math.min(1, 1280 / croppedCanvas.width, 720 / croppedCanvas.height);
    canvas.width = croppedCanvas.width * scale;
    canvas.height = croppedCanvas.height * scale;
    const ctx = canvas.getContext('2d');
    //build list to shuffle
    const cols = 20, rows = 20;
    const tiles = [];
    for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++)
            tiles.push({r,c});
    
    // shuffle time
    tiles.sort(() => Math.random() - 0.5)//0.5 so it returns either negative or positive

    ctx.strokeStyle = 'grey';
    ctx.lineWidth = 2;
    //generate an image
    const tileW = canvas.width / cols;
    const tileH = canvas.height / rows;
    const stages = [];
    for (let stage = 0; stage <20; stage++){//stages set to 20 here for 20 images generated
        ctx.drawImage(croppedCanvas, 0, 0, canvas.width, canvas.height);

        const revealed = Math.floor(((stage + 1) / 20 ) * tiles.length); 
        

        //draw the white
        ctx.fillStyle = 'white';
        tiles.slice(revealed).forEach(({r,c}) => {
            ctx.fillRect(c * tileW, r * tileH, Math.ceil(tileW), Math.ceil(tileH));
            ctx.strokeRect(c * tileW, r * tileH, Math.ceil(tileW), Math.ceil(tileH));
        });

        stages.push(canvas.toDataURL('image/png'));
    }
    const testPreview = document.getElementById('test-preview');
    testPreview.src = stages[9];
    testPreview.style.display = 'block';
    window.parent.postMessage({ stages: stages }, '*');
    setStatus("ready", "Finished generating 20 stages...")
    
});

function setStatus(state, text) {
    statusEl.className = 'status' + (state ? ' ' + state : '');
    statusText.textContent = text;
}
