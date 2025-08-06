// HTML 요소 가져오기
const chatWindow = document.getElementById('chat-window');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

// URL에서 선택된 서예가 정보 가져오기
const urlParams = new URLSearchParams(window.location.search);
const selectedCalligrapher = urlParams.get('calligrapher') || '김정희';

// 입력창 placeholder 업데이트
userInput.placeholder = `${selectedCalligrapher} 선생님께 질문을 입력하세요...`;


// 전송 버튼 클릭 또는 Enter 키 입력 시 메시지 전송
sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

// 페이지 로드 시 첫 메시지 표시
window.onload = () => {
    chatWindow.innerHTML = `<div class="initial-message">${selectedCalligrapher} 선생님께 질문을 시작해보세요!</div>`;
};


/** 메시지를 채팅창에 추가하는 함수 (화자 이름 표시 기능 추가) */
function addMessage(speaker, message, sender) {
    const initialMessage = document.querySelector('.initial-message');
    if (initialMessage) {
        initialMessage.remove();
    }

    const messageElement = document.createElement('div');
    messageElement.classList.add('chat-message', sender);
    
    // 화자 이름(strong)과 메시지(p)를 담는 구조로 변경
    messageElement.innerHTML = `
        <strong>${speaker}</strong>
        <p>${message}</p>
    `;
    
    chatWindow.appendChild(messageElement);
    chatWindow.scrollTop = chatWindow.scrollHeight;
    return messageElement;
}


/** 사용자 메시지를 서버로 보내고 답변을 받는 함수 */
async function sendMessage() {
    const message = userInput.value.trim();
    if (message === '') return;

    addMessage('나', message, 'user');
    userInput.value = '';

    const loadingMessage = addMessage(selectedCalligrapher + ' 선생님', '생각 중...', 'bot-loading');

    try {
        const response = await fetch('https://seoye.onrender.com/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: message,
                calligrapher: selectedCalligrapher
            }),
        });

        if (!response.ok) throw new Error('서버 응답 오류');
        
        const data = await response.json();
        
        // 로딩 메시지를 실제 답변으로 교체
        loadingMessage.querySelector('p').textContent = data.reply;
        loadingMessage.classList.remove('bot-loading');
        loadingMessage.classList.add('bot');

    } catch (error) {
        console.error('챗봇 통신 오류:', error);
        loadingMessage.querySelector('p').textContent = '이런, 대화 중에 잠시 문제가 생긴 듯하네. 다시 한번 말해주겠나?';
        loadingMessage.classList.remove('bot-loading');
        loadingMessage.classList.add('bot');
    }
}