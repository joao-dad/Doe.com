const chats = JSON.parse(localStorage.getItem('chats')) || [];

const chatListContainer = document.querySelector('.chat-list');
const chatContent = document.querySelector('.chat-content');

const deleteChatBtn = document.getElementById('deleteChatBtn');
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

  const sortedChats = [...chats].sort((a, b) => {
    const lastA =
      a.messages[a.messages.length - 1]?.date || 0;
    const lastB =
      b.messages[b.messages.length - 1]?.date || 0;

    return new Date(lastB) - new Date(lastA);
  });

  sortedChats.forEach(chat => {
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

chatTitle.textContent = activeChat.userName || activeChat.userEmail;
chatSubtitle.textContent = 'Parceiro';


  messageForm.style.display = 'flex';

  // MOSTRAR botão apagar
  if (deleteChatBtn) {
    deleteChatBtn.style.display = 'inline-block';
  }

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

/* ===============================
   APAGAR CONVERSA (ADMIN)
================================ */
if (deleteChatBtn) {
  deleteChatBtn.addEventListener('click', () => {
    if (!activeChat) return;

    const confirmDelete = confirm(
      'Tem a certeza que deseja eliminar esta conversa inteira?'
    );

    if (!confirmDelete) return;

    const updatedChats = chats.filter(
      chat => chat.id !== activeChat.id
    );

    localStorage.setItem(
      'chats',
      JSON.stringify(updatedChats)
    );

    // limpar UI
    activeChat = null;
    messagesContainer.innerHTML = '';
    chatTitle.textContent = 'Selecione uma conversa';
    chatSubtitle.textContent = '';
    messageForm.style.display = 'none';
    deleteChatBtn.style.display = 'none';

    // atualizar lista
    chats.length = 0;
    updatedChats.forEach(c => chats.push(c));
    renderChatList();
  });
}



//botão voltar
const backBtn = document.getElementById('backToChats');

if (backBtn) {
  backBtn.addEventListener('click', () => {
    chatListContainer.classList.remove('hidden');
    chatContent.classList.remove('active');
  });
}
