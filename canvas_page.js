// --- 1. 각 연습 항목에 맞는 영상 ID와 이미지 파일 '지도' ---
const practiceData = {
    '곧은획_1': { titleImage: 'practice_title_1.png' ,videoId: '1Uyj7-ilzRw', images: ['practice_guide_1.png', 'practice_guide_2.png'] },
    '곧은획_2': { titleImage: 'practice_title_2.png', videoId: 'X0sCkWiONzw', images: ['practice_guide_3.png', 'practice_guide_4.png', 'practice_guide_5.png'] },
    '꺾은획_1': { titleImage: 'practice_title_3.png', videoId: '8QXdhZ8iFQE', images: ['practice_guide_6.png', 'practice_guide_7.png', 'practice_guide_8.png'] },
    '꺾은획_2': { titleImage: 'practice_title_4.png', videoId: 'J2ZRpkej2_k', images: ['practice_guide_9.png', 'practice_guide_10.png', 'practice_guide_11.png'] },
    '비스듬한획': { titleImage: 'practice_title_5.png', videoId: 'F-YiVSfVYcw', images: ['practice_guide_12.png', 'practice_guide_13.png', 'practice_guide_14.png'] },
    '굽은획': { titleImage: 'practice_title_6.png', videoId: '9NbhhJwMWIQ', images: ['practice_guide_15.png', 'practice_guide_16.png'] },
    '기본': { title: '기본', videoId: 'DEFAULT_VIDEO_ID', images: [] }
};

// --- 2. 페이지 로드 시 동적 콘텐츠 설정 ---
const urlParams = new URLSearchParams(window.location.search);
const practiceItem = urlParams.get('item') || '기본';
const data = practiceData[practiceItem] || practiceData['기본'];

// 제목 이미지 설정
document.getElementById('practice-title-image').src = `images/${data.titleImage}`;
document.getElementById('practice-title-image').alt = practiceItem.replace(/_/g, ' ');

const videoFrame = document.getElementById('youtube-video');
videoFrame.src = `https://www.youtube.com/embed/${data.videoId}?rel=0`;

const canvasWrapper = document.getElementById('canvas-wrapper');
const allCanvases = [];

data.images.forEach((imageName, index) => {
    const canvas = document.createElement('canvas');
    canvas.id = `canvas-${index}`;
    canvas.width = 400;
    canvas.height = 400;
    canvas.style.backgroundImage = `url('images/${imageName}')`;
    canvasWrapper.appendChild(canvas);
    allCanvases.push(canvas);
});


// --- 3. 캔버스 그리기 로직 ---
const brushButton = document.getElementById('brush-button');
const eraserButton = document.getElementById('eraser-button');
const strokeSlider = document.getElementById('stroke-width');
const clearButton = document.getElementById('clear-button');

let isDrawing = false;
let isErasing = false;

allCanvases.forEach(canvas => {
    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = strokeSlider.value;

    let lastX = 0;
    let lastY = 0;

    canvas.addEventListener('pointerdown', (e) => { isDrawing = true; [lastX, lastY] = [e.offsetX, e.offsetY]; });
    canvas.addEventListener('pointermove', (e) => {
        if (!isDrawing) return;
        const pressure = e.pointerType === 'pen' ? e.pressure : 0.5;
        ctx.lineWidth = isErasing ? strokeSlider.value : strokeSlider.value * pressure;
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
        [lastX, lastY] = [e.offsetX, e.offsetY];
    });
    canvas.addEventListener('pointerup', () => isDrawing = false);
    canvas.addEventListener('pointerleave', () => isDrawing = false);
});

brushButton.addEventListener('click', () => setTool('brush'));
eraserButton.addEventListener('click', () => setTool('eraser'));
strokeSlider.addEventListener('input', (e) => {
    allCanvases.forEach(canvas => { canvas.getContext('2d').lineWidth = e.target.value; });
});
clearButton.addEventListener('click', () => {
    allCanvases.forEach(canvas => { canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height); });
});

function setTool(tool) {
    isErasing = (tool === 'eraser');
    brushButton.classList.toggle('active', !isErasing);
    eraserButton.classList.toggle('active', isErasing);
    const mode = isErasing ? 'destination-out' : 'source-over';
    allCanvases.forEach(canvas => { canvas.getContext('2d').globalCompositeOperation = mode; });
}

setTool('brush');