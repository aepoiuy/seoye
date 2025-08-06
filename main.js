// 클릭할 링크 요소들 가져오기
const guideLink = document.getElementById('click-guide');
const stationeryLink = document.getElementById('click-stationery');
const practiceLink = document.getElementById('click-practice');
const calligrapherLink = document.getElementById('click-calligrapher-house');
const galleryLink = document.getElementById('click-gallery');

// 팝업(모달) 관련 요소들
const guideModal = document.getElementById('guide-modal');
const closeModalButton = document.getElementById('close-modal-button');

// 안내판 링크 클릭 시 팝업 보이기
guideLink.addEventListener('click', (e) => {
    e.preventDefault(); // 링크의 기본 동작(페이지 이동) 막기
    if (guideModal) {
        guideModal.classList.remove('modal-hidden');
        guideModal.classList.add('modal-overlay');
    }
});

// 각 장소 링크 클릭 시 페이지 이동
stationeryLink.addEventListener('click', (e) => { e.preventDefault(); window.location.href = 'stationery_menu.html'; });
practiceLink.addEventListener('click', (e) => { e.preventDefault(); window.location.href = 'practice_select.html'; });
calligrapherLink.addEventListener('click', (e) => { e.preventDefault(); window.location.href = 'chatbot_select.html'; });
galleryLink.addEventListener('click', (e) => { e.preventDefault(); window.location.href = 'gallery.html'; });


// 팝업 닫기 버튼
if (closeModalButton) {
    closeModalButton.addEventListener('click', () => {
        if (guideModal) {
            guideModal.classList.add('modal-hidden');
            guideModal.classList.remove('modal-overlay');
        }
    });
}

// 팝업 배경 클릭 시 닫기
if (guideModal) {
    guideModal.addEventListener('click', (event) => {
        if (event.target === guideModal) {
            guideModal.classList.add('modal-hidden');
            guideModal.classList.remove('modal-overlay');
        }
    });
}