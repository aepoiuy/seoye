// HTML 요소 가져오기
const imageUploadInput = document.getElementById('image-upload-input');
const imagePreview = document.getElementById('image-preview');
const previewText = document.getElementById('preview-text');
const aiFeedbackButton = document.getElementById('ai-feedback-button');
const feedbackContent = document.getElementById('feedback-content'); // feedback-panel 내부의 div

let uploadedImageData = null; // 업로드된 이미지 데이터를 저장할 변수

// 파일 선택 시 미리보기 기능
imageUploadInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.src = e.target.result;
            imagePreview.classList.remove('hidden');
            previewText.classList.add('hidden');
            uploadedImageData = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// 'AI 분석' 버튼 클릭 이벤트
aiFeedbackButton.addEventListener('click', getAIFeedback);


// AI 피드백 요청 함수
async function getAIFeedback() {
    if (!uploadedImageData) {
        alert('먼저 분석할 이미지 파일을 선택해주세요.');
        return;
    }

    // word 정보 없이 이미지만 데이터에 담습니다.
    const data = {
        image: uploadedImageData
    };

    try {
        feedbackContent.innerHTML = '<h2>AI가 분석 중입니다.</h2>';

        // 서버의 /analyze 주소로 요청을 보냅니다.
        const response = await fetch('https://seoye.onrender.com/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (!response.ok) throw new Error('서버 통신 실패');
        const result = await response.json();

        // 점수 없이 피드백 메시지만 표시합니다.
        feedbackContent.innerHTML = `
            <h2>AI 분석 결과</h2>
            <p>"${result.message}"</p>
        `;

    } catch (error) {
        console.error('AI 피드백 오류:', error);
        feedbackContent.innerHTML = '<h2>오류</h2><p>분석에 실패했습니다. 서버가 켜져 있는지 확인해주세요.</p>';
    }
}