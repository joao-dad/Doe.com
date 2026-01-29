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

// helper seguro
function $(id) {
  return document.getElementById(id);
}

document.addEventListener('DOMContentLoaded', () => {
  const user = getLoggedUser?.();
  if (!user) return;

  // MENU
  const loginLink = $('loginLink');
  const logoutBtn = $('logoutBtn');
  const donationBtn = $('donationActionBtn');
  const itemsLink = $('itemsLink');

  if (loginLink) loginLink.style.display = 'none';
  if (logoutBtn) logoutBtn.style.display = 'inline-block';

  if (user.type === 'ONG') {
    if (donationBtn) donationBtn.textContent = 'Pedido de Doação';
    if (itemsLink) itemsLink.style.display = 'none';
  } else {
    if (donationBtn) donationBtn.textContent = 'Fazer uma Doação';
  }

  // HOME
  const individualContent = $('individualContent');
  const ongContent = $('ongContent');

  if (individualContent && ongContent) {
    individualContent.style.display =
      user.type === 'ONG' ? 'none' : 'block';
    ongContent.style.display =
      user.type === 'ONG' ? 'block' : 'none';
  }

  updateMessagesMenu(user);
});

// contador mensagens
function updateMessagesMenu(user) {
  const link = $('messagesMenuLink');
  if (!link) return;

  const chats = JSON.parse(localStorage.getItem('chats')) || [];
  let unread = 0;

  chats.forEach(chat => {
    if (
      chat.userEmail !== user.email &&
      chat.ongEmail !== user.email
    ) return;

    chat.messages.forEach(msg => {
      if (
        msg.sender !== user.email &&
        (!msg.readBy || !msg.readBy.includes(user.email))
      ) {
        unread++;
      }
    });
  });

  link.textContent =
    unread > 0 ? `Mensagens (${unread})` : 'Mensagens';
}

// Logout
  logoutBtn.addEventListener('click', () => {
    const confirmLogout = confirm(
      'Tem a certeza que deseja terminar a sessão?'
    );

    if (!confirmLogout) return;

    localStorage.removeItem('loggedUser');
    window.location.href = 'index.html';
  });