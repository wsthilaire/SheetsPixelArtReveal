

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
    // TODO: tile generation logic goes here
});

function setStatus(state, text) {
    statusEl.className = 'status' + (state ? ' ' + state : '');
    statusText.textContent = text;
}
