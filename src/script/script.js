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


//Botão parceria
const partnerBtn = document.getElementById('partnerBtn');

if (partnerBtn) {
  partnerBtn.addEventListener('click', () => {
    const user = getLoggedUser();

    if (!user) {
      window.location.href = 'login.html';
      return;
    }

    startAdminChat(user);
  });
}
//abrir chat-adm
function startAdminChat(user) {
  let chats = JSON.parse(localStorage.getItem('chats')) || [];

  let chat = chats.find(
    c =>
      c.type === 'ADMIN' &&
      c.userEmail === user.email
  );

  if (!chat) {
    chat = {
      id: Date.now().toString(),
      type: 'ADMIN',
      userEmail: user.email,
      userName: user.name || user.organizationName,
      adminEmail: 'adm@gmail.com',
      messages: [
        {
          sender: user.email,
          text: 'Olá! \nTenho interesse em tornar-me parceiro da Kambia e gostaria de saber como posso colaborar.\n\nFico disponível para mais informações.',
          date: new Date().toISOString(),
          readBy: []
        }
      ]
    };

    chats.push(chat);
    localStorage.setItem('chats', JSON.stringify(chats));
  }

  window.location.href = `chat.html?chatId=${chat.id}`;
}


// CONTADOR DE MENSAGENS
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


  function getDonationRequests() {
  const data = localStorage.getItem('donationRequests');
  return data ? JSON.parse(data) : [];
}

function saveDonationRequests(requests) {
  localStorage.setItem(
    'donationRequests',
    JSON.stringify(requests)
  );
}
