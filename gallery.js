// 필요한 HTML 요소들 가져오기
const galleryItems = document.querySelectorAll('.gallery-item');
const imageModal = document.getElementById('image-modal');
const modalImage = document.getElementById('modal-image');
const closeButton = document.getElementById('close-image-modal');

// 모든 갤러리 이미지에 클릭 이벤트 추가
galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        // 클릭한 이미지의 주소(src)를 모달 안의 이미지 주소로 설정
        modalImage.src = item.src;
        // 모달 창 보이기
        imageModal.classList.remove('modal-hidden');
        imageModal.classList.add('modal-overlay');
    });
});

// 모달 닫기 기능
function closeModal() {
    imageModal.classList.add('modal-hidden');
    imageModal.classList.remove('modal-overlay');
}

// 닫기 버튼(X)을 클릭하면 모달 닫기
closeButton.addEventListener('click', closeModal);

// 모달의 배경 부분을 클릭하면 모달 닫기
imageModal.addEventListener('click', (event) => {
    if (event.target === imageModal) {
        closeModal();
    }
});