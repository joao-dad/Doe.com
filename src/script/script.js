/*Menu Mobile */

const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

function $(id) {
  return document.getElementById(id);
}

const menu = $('menu');
if (menu) {
  menu.style.display = 'none';
}


 function $(id) {
  return document.getElementById(id);
}

// ===============================
// DOM READY
// ===============================
document.addEventListener('DOMContentLoaded', () => {
  const user = JSON.parse(localStorage.getItem('loggedUser'));

  // -------------------------------
  // MENU / HEADER
  // -------------------------------
  const loginLink = $('loginLink');
  const logoutBtn = $('logoutBtn');
  const donationBtn = $('donationActionBtn');
  const itemsLink = $('itemsLink');
  const messagesLink = $('messagesMenuLink');

  // NÃO LOGADO
  if (!user) {
    if (logoutBtn) logoutBtn.style.display = 'none';
    return;
  }

  // LOGADO
  if (loginLink) loginLink.style.display = 'none';
  if (logoutBtn) logoutBtn.style.display = 'inline-block';

  // ONG
  if (user.type === 'ONG') {
    if (donationBtn) donationBtn.textContent = 'Pedido de Doação';
    if (itemsLink) itemsLink.style.display = 'none';
  }

  // INDIVIDUAL
  if (user.type === 'Individual') {
    if (donationBtn) donationBtn.textContent = 'Fazer uma Doação';
  }

  // -------------------------------
  // HOME: VISÃO INDIVIDUAL / ONG
  // -------------------------------
  const individualContent = $('individualContent');
  const ongContent = $('ongContent');

  if (individualContent && ongContent) {
    if (user.type === 'ONG') {
      individualContent.style.display = 'none';
      ongContent.style.display = 'block';
    } else {
      individualContent.style.display = 'block';
      ongContent.style.display = 'none';
    }
  }

  // -------------------------------
  // CONTADOR DE MENSAGENS
  // -------------------------------
  updateMessagesMenu(user);

  // -------------------------------
  // LOGOUT
  // -------------------------------

});

// ===============================
// FUNÇÃO: CONTADOR DE MENSAGENS
// ===============================
function updateMessagesMenu(loggedUser) {
  const link = $('messagesMenuLink');
  if (!link || !loggedUser) return;

  const chats = JSON.parse(localStorage.getItem('chats')) || [];
  let unreadCount = 0;

  chats.forEach(chat => {
    const isParticipant =
      chat.userEmail === loggedUser.email ||
      chat.ongEmail === loggedUser.email;

    if (!isParticipant) return;

    chat.messages.forEach(msg => {
      if (
        msg.sender !== loggedUser.email &&
        (!msg.readBy || !msg.readBy.includes(loggedUser.email))
      ) {
        unreadCount++;
      }
    });
  });

  link.textContent =
    unreadCount > 0 ? `Mensagens (${unreadCount})` : 'Mensagens';
}




