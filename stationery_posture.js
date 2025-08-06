const hotspots = document.querySelectorAll('.posture-hotspot');
const modal = document.getElementById('posture-detail-modal');
const modalImage = document.getElementById('posture-detail-image');
const closeModalButton = document.getElementById('close-posture-modal');

hotspots.forEach(spot => {
    spot.addEventListener('click', (e) => {
        e.preventDefault();
        const imageName = spot.dataset.image;
        modalImage.src = `images/${imageName}`;
        modal.classList.remove('modal-hidden');
        modal.classList.add('modal-overlay');
    });
});

function closeModal() {
    modal.classList.add('modal-hidden');
    modal.classList.remove('modal-overlay');
}

closeModalButton.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});