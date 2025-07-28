// 필요한 HTML 요소들 가져오기
const copyrightLink = document.getElementById('copyright-link');
const copyrightModal = document.getElementById('copyright-modal');
const closeModalButton = document.getElementById('close-copyright-modal');

// '저작권 안내' 링크 클릭 시 팝업 보이기
if (copyrightLink) {
    copyrightLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (copyrightModal) {
            copyrightModal.classList.remove('modal-hidden');
            copyrightModal.classList.add('modal-overlay');
        }
    });
}


// 모달 닫기 기능
function closeModal() {
    if (copyrightModal) {
        copyrightModal.classList.add('modal-hidden');
        copyrightModal.classList.remove('modal-overlay');
    }
}

// 닫기 버튼(X)을 클릭하면 모달 닫기
if (closeModalButton) {
    closeModalButton.addEventListener('click', closeModal);
}

// 모달의 배경 부분을 클릭하면 모달 닫기
if (copyrightModal) {
    copyrightModal.addEventListener('click', (event) => {
        if (event.target === copyrightModal) {
            closeModal();
        }
    });
}