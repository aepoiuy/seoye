// --- 1. 각 글자별 영상 ID와 이미지 파일 '지도' ---

const wordPracticeData = {
    '나무': { titleImage: 'practice_title_7.png', videoId: 'Z3ivXIea8xk', images: ['practice_guide_17.png', 'practice_guide_18.png'] },
    '고운소리': { titleImage: 'practice_title_8.png', videoId: '8sKgPc5nOUg', images: ['practice_guide_19.png', 'practice_guide_20.png', 'practice_guide_21.png', 'practice_guide_22.png'] },
    '푸른하늘': { titleImage: 'practice_title_9.png', videoId: 'Sx95MdgWKYA', images: ['practice_guide_23.png', 'practice_guide_24.png', 'practice_guide_25.png', 'practice_guide_26.png'] },
    '기본': { videoId: 'DEFAULT_VIDEO_ID', images: [] } // 기본값
};

// --- 2. 페이지 로드 시 동적 콘텐츠 생성 ---
const urlParams = new URLSearchParams(window.location.search);
const practiceItem = urlParams.get('item') || '기본';
const data = wordPracticeData[practiceItem] || wordPracticeData['기본'];

document.getElementById('practice-title-image').src = `images/${data.titleImage}`;

const videoFrame = document.getElementById('youtube-video');
videoFrame.src = `https://www.youtube.com/embed/${data.videoId}?rel=0`;

const canvasWrapper = document.getElementById('canvas-wrapper');
const allCanvases = []; // 생성된 모든 캔버스의 정보를 저장할 배열

// 필요한 만큼 캔버스 동적 생성
data.images.forEach((imageName, index) => {
    const canvas = document.createElement('canvas');
    canvas.id = `canvas-${index}`;
    canvas.width = 400;
    canvas.height = 400;
    canvas.style.backgroundImage = `url('images/${imageName}')`;
    canvasWrapper.appendChild(canvas);
    allCanvases.push(canvas); // 배열에 추가
});


// --- 3. 캔버스 그리기 로직 (이전과 동일) ---
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

// 전역 컨트롤러
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