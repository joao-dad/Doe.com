const chats = JSON.parse(localStorage.getItem('chats')) || [];

const chatListContainer = document.querySelector('.chat-list');
const chatContent = document.querySelector('.chat-content');

const chatList = document.getElementById('chatList');
const messagesContainer = document.getElementById('messagesContainer');
const chatTitle = document.getElementById('chatTitle');
const chatSubtitle = document.getElementById('chatSubtitle');
const messageForm = document.getElementById('messageForm');
const messageInput = document.getElementById('messageInput');

let activeChat = null;

/* ===============================
   LISTAR CONVERSAS
================================ */
function renderChatList() {
  chatList.innerHTML = '';

  if (chats.length === 0) {
    chatList.innerHTML = '<li>Nenhuma conversa</li>';
    return;
  }

  chats.forEach(chat => {
    const li = document.createElement('li');
    li.className = 'chat-item';

    li.innerHTML = `
      <strong>${chat.userEmail}</strong><br>
      <small>${chat.ongEmail}</small>
    `;

    li.onclick = () => {
  openChat(chat.id);

  // MOBILE: esconder lista, mostrar chat
  if (window.innerWidth <= 768) {
    document.querySelector('.chat-list')?.classList.add('hidden');
    document.querySelector('.chat-content')?.classList.add('active');
  }
};

    chatList.appendChild(li);
  });
}

/* ===============================
   ABRIR CHAT
================================ */
function openChat(chatId) {
  activeChat = chats.find(c => c.id === chatId);
  if (!activeChat) return;

  chatTitle.textContent = 'Conversa';
  chatSubtitle.textContent =
    `${activeChat.userEmail} ↔ ${activeChat.ongEmail}`;

  messageForm.style.display = 'flex';
  renderMessages();
}

/* ===============================
   RENDER MENSAGENS
================================ */
function renderMessages() {
  messagesContainer.innerHTML = '';

  activeChat.messages.forEach(msg => {
    const div = document.createElement('div');
    div.className =
      msg.sender === 'Administrador'
        ? 'message Adminstrador'
        : 'message';

    div.innerHTML = `
      <small style="font-weight: 600;">${msg.sender}</small>
      <p>${msg.text}</p>
      <small style="opacity:0.5">${new Date(msg.date).toLocaleString()}</small>
    `;

    messagesContainer.appendChild(div);
  });

  messagesContainer.scrollTop =
    messagesContainer.scrollHeight;
}

/* ===============================
   ENVIAR MENSAGEM
================================ */
messageForm.addEventListener('submit', e => {
  e.preventDefault();

  const text = messageInput.value.trim();
  if (!text) return;

  activeChat.messages.push({
    sender: 'Admin-Doe',
    text,
    date: new Date().toISOString(),
    readBy: []
  });

  localStorage.setItem('chats', JSON.stringify(chats));
  messageInput.value = '';
  renderMessages();
});

renderChatList();


//botão voltar
const backBtn = document.getElementById('backToChats');

if (backBtn) {
  backBtn.addEventListener('click', () => {
    chatListContainer.classList.remove('hidden');
    chatContent.classList.remove('active');
  });
}
