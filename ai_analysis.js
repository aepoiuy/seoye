// HTML 요소 가져오기
const imageUploadInput = document.getElementById('image-upload-input');
const imagePreview = document.getElementById('image-preview');
const previewText = document.getElementById('preview-text');
const aiFeedbackButton = document.getElementById('ai-feedback-button');
const feedbackContent = document.getElementById('feedback-content'); // feedback-panel 내부의 div

// 파일 선택 시 미리보기 기능
imageUploadInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.src = e.target.result;
            imagePreview.classList.remove('hidden');
            previewText.classList.add('hidden');
            // uploadedImageData 변수는 더 이상 사용하지 않아도 됩니다.
        };
        reader.readAsDataURL(file);
    }
});

// 'AI 분석' 버튼 클릭 이벤트
aiFeedbackButton.addEventListener('click', getAIFeedback);


// AI 피드백 요청 함수
async function getAIFeedback() {
    // uploadedImageData 대신 input 요소에서 직접 파일을 가져옵니다.
    const file = imageUploadInput.files[0];

    if (!file) {
        alert('먼저 분석할 이미지 파일을 선택해주세요.');
        return;
    }

    // --- 핵심 수정 사항 ---
    // 1. FormData 객체 생성
    const formData = new FormData();
    // 2. 'image_file' 이라는 키로 실제 파일 첨부
    formData.append('image_file', file);
    // ----------------------

    try {
        feedbackContent.innerHTML = '<h2>AI가 분석 중입니다.</h2>';

        // 서버의 /analyze 주소로 요청을 보냅니다.
        const response = await fetch('https://seoye.onrender.com/analyze', {
            method: 'POST',
            // 3. headers와 body를 FormData에 맞게 수정
            // Content-Type 헤더는 브라우저가 자동으로 설정하므로 제거합니다.
            body: formData,
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
        feedbackContent.innerHTML = '<h2>오류</h2><p>분석에 실패했습니다. 잠시 후 다시 시도해주세요.</p>';
    }
}