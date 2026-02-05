// CHAT - CONVERSA
function getChatDisplayName(chat, loggedUser) {
  // CHAT COM ADMIN
  if (chat.type === 'admin') {
    if (loggedUser.type === 'Admin') {
      return chat.userName || chat.userEmail;
    }
    return chat.adminName || 'Administrador';
  }

  // CHAT NORMAL (ONG ↔ USER)
  if (loggedUser.email === chat.ongEmail) {
    return chat.userName || chat.userEmail;
  }

  return chat.ongName || chat.ongEmail || 'ONG';
}




/*** */


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
  window.location.href = 'index.html';
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

if (chat.type === 'ADMIN') {
  // Chat com administrador
  chatTitle.textContent = 'Admin';
  chatSubtitle.textContent = 'Parcerias';
} else {
  // Chat normal ONG ↔ utilizador
  const otherEmail =
    loggedUser.email === chat.userEmail
      ? chat.ongEmail
      : chat.userEmail;

  chatTitle.textContent = otherEmail;
  chatSubtitle.textContent =
    loggedUser.email === chat.ongEmail
      ? 'Pedido de ajuda'
      : 'ONG';
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
      <small style="font-weight: 600; font-size: 11px">${msg.sender}</small>
      <p>${msg.text}</p>
      <small style="opacity:0.5; font-size: 10px">${new Date(msg.date).toLocaleString()}</small>
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
  senderName:
    loggedUser.type === 'ONG'
      ? loggedUser.organizationName
      : loggedUser.name,
  text,
  date: new Date().toISOString()
});


localStorage.setItem('chats', JSON.stringify(chats));

  messageInput.value = '';
  renderMessages();
});







