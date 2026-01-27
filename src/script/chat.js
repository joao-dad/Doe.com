// =============================
// CHAT - CONVERSA
// =============================

const loggedUser = getLoggedUser();
const params = new URLSearchParams(window.location.search);
const chatId = params.get('chatId');

// ELEMENTOS
const messagesContainer = document.getElementById('messagesContainer');
const messageForm = document.getElementById('messageForm');
const messageInput = document.getElementById('messageInput');
const chatTitle = document.getElementById('chatTitle');
const chatSubtitle = document.getElementById('chatSubtitle');

// AUTENTICAÇÃO
if (!loggedUser) {
  alert('Precisa estar logado.');
  window.location.href = 'login.html';
}

// SEM chatId → VOLTA PARA LISTA
if (!chatId) {
  window.location.href = 'chats.html';
}

// BUSCAR CHAT
let chats = JSON.parse(localStorage.getItem('chats')) || [];
let chat = chats.find(c => c.id === chatId);

//marcar c/lido ao abrir
let updated = false;

chat.messages.forEach(msg => {
  if (!msg.readBy) msg.readBy = [];

  if (!msg.readBy.includes(loggedUser.email)) {
    msg.readBy.push(loggedUser.email);
    updated = true;
  }
});

if (updated) {
  localStorage.setItem('chats', JSON.stringify(chats));
}


if (!chat) {
  alert('Chat não encontrado.');
  window.location.href = 'chats.html';
}


// VERIFICA SE O UTILIZADOR PERTENCE AO CHAT
const isParticipant =
  chat.userEmail === loggedUser.email ||
  chat.ongEmail === loggedUser.email;

if (!isParticipant) {
  alert('Não tens acesso a este chat.');
  window.location.href = 'chats.html';
}

// =============================
// TÍTULO DO CHAT
// =============================
if (loggedUser.email === chat.ongEmail) {
  chatTitle.textContent = chat.userName;
  chatSubtitle.textContent = 'Doação para pedido';
} else {
  chatTitle.textContent = chat.ongName;
  chatSubtitle.textContent = 'ONG';
}

// =============================
// RENDER MENSAGENS
// =============================
function renderMessages() {
  messagesContainer.innerHTML = '';

  if (!chat.messages.length) {
    messagesContainer.innerHTML =
      '<p class="empty-chat">Nenhuma mensagem ainda.</p>';
    return;
  }

  chat.messages.forEach(msg => {
    const div = document.createElement('div');
    div.classList.add(
      'message',
      msg.sender === loggedUser.email ? 'sent' : 'received'
    );

    div.innerHTML = `
      <p>${msg.text}</p>
      <small>${new Date(msg.date).toLocaleString()}</small>
    `;

    messagesContainer.appendChild(div);
  });

  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

renderMessages();

// =============================
// ENVIAR MENSAGEM
// =============================
messageForm.addEventListener('submit', e => {
  e.preventDefault();

  const text = messageInput.value.trim();
  if (!text) return;

  chat.messages.push({
  sender: loggedUser.email,
  text,
  date: new Date().toISOString(),
  readBy: [loggedUser.email]
});

localStorage.setItem('chats', JSON.stringify(chats));

  messageInput.value = '';
  renderMessages();
});







