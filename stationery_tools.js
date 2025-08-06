const hotspots = document.querySelectorAll('.tool-hotspot');
const modal = document.getElementById('tool-detail-modal');
const modalImage = document.getElementById('tool-detail-image');
const closeModalButton = document.getElementById('close-tool-modal');

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