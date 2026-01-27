// =============================
// LISTA DE CHATS (INBOX)
// =============================

const loggedUser = getLoggedUser();

const chatsList = document.getElementById('chatsList');
const noChats = document.getElementById('noChats');

const chats = JSON.parse(localStorage.getItem('chats')) || [];

// só chats onde o utilizador participa
const myChats = chats.filter(
  c =>
    c.userEmail === loggedUser.email ||
    c.ongEmail === loggedUser.email
);

if (!myChats.length) {
  noChats.style.display = 'block';
} else {
  noChats.style.display = 'none';

  myChats.forEach(chat => {
    const isOng = loggedUser.email === chat.ongEmail;
    const otherName = isOng ? chat.userName : chat.ongName;

    const lastMsg = chat.messages[chat.messages.length - 1];

    const lastText = lastMsg
      ? `${lastMsg.sender === loggedUser.email ? 'Você: ' : ''}${lastMsg.text}`
      : 'Nenhuma mensagem ainda';

    // mensagens não lidas
    const unreadCount = chat.messages.filter(
      m => !m.readBy?.includes(loggedUser.email)
    ).length;

    const card = document.createElement('div');
    card.className = 'chat-card';

    card.innerHTML = `
      <div class="chat-info">
        <h4>${otherName}</h4>
        <p class="chat-preview">${lastText}</p>
      </div>

      ${
        unreadCount
          ? `<span class="chat-badge">${unreadCount}</span>`
          : ''
      }
    `;

    card.addEventListener('click', () => {
      window.location.href = `chat.html?chatId=${chat.id}`;
    });

    chatsList.appendChild(card);
  });
}
