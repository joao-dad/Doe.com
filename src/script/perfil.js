// profile.js


document.addEventListener('DOMContentLoaded', () => {
  // 1. Verificar autenticação
  const loggedUser = JSON.parse(localStorage.getItem('loggedUser'));

  if (!loggedUser) {
    window.location.href = 'login.html';
    return;
  }

  /* Ver doações / pedidos */

  const individualSection = document.getElementById('individualSection');
const ongSection = document.getElementById('ongSection');

if (loggedUser.type === 'ONG') {
  individualSection.style.display = 'none';
  ongSection.style.display = 'block';

  loadMyRequests(loggedUser);
} else {
  ongSection.style.display = 'none';
  individualSection.style.display = 'block';

  loadMyDonations(loggedUser);
}


  // 2. Preencher dados do perfil
  const profileName = document.getElementById('profileName');
  const profileEmail = document.getElementById('profileEmail');
  const profileLocation = document.getElementById('profileLocation');
  const profileType = document.getElementById('profileType');
  const profileNif = document.getElementById('profileNif');
  const profileArea = document.getElementById('profileArea');

  if (loggedUser.type === 'ONG') {
    profileName.textContent = loggedUser.organizationName;
    profileType.textContent = 'Conta ONG';

    if (profileNif) {
      profileNif.textContent = `NIF: ${loggedUser.nif}`;
      profileNif.style.display = 'block';
    }

    if (profileArea) {
      profileArea.textContent = `Área de atuação: ${loggedUser.area}`;
      profileArea.style.display = 'block';
    }
  } else {
    profileName.textContent = loggedUser.name;
    profileType.textContent = 'Conta Individual';
  }

  profileEmail.textContent = loggedUser.email;
  profileLocation.textContent = loggedUser.location || '—';

  // =========================
  // 3. ONG → carregar pedidos
  // =========================
  if (loggedUser.type === 'ONG') {
    loadMyRequests(loggedUser);
  }
});


// =========================
// Carregar pedidos da ONG
// =========================
function loadMyRequests(user) {
  const grid = document.getElementById('myRequestsGrid');
  const empty = document.getElementById('noRequests');

  if (!grid || !empty) return;

  const requests =
    JSON.parse(localStorage.getItem('donationRequests')) || [];

  const myRequests = requests.filter(
    req => req.ongEmail === user.email
  );

  if (myRequests.length === 0) {
    empty.style.display = 'block';
    return;
  }

  empty.style.display = 'none';
  grid.innerHTML = '';

  myRequests.forEach(req => {
    const card = document.createElement('div');
    card.className = 'item-card';

    card.innerHTML = `
      <div class="item-content">
        <h3>${req.title}</h3>
        <p class="item-category">${req.category}</p>
        <p class="item-location">${req.location}</p>
        <p class="item-date">Publicado em ${req.date}</p>
        <p class="item-priority">Urgência: ${req.priority}</p>

        <button class="btn btn-outline btn-small remove-request">
          Remover Pedido
        </button>
      </div>
    `;

    // =========================
    // Remover pedido
    // =========================
    card.querySelector('.remove-request').addEventListener('click', () => {
      if (!confirm('Tem a certeza que deseja remover este pedido?')) return;

      const updated = requests.filter(r => r.id !== req.id);
      localStorage.setItem(
        'donationRequests',
        JSON.stringify(updated)
      );

      card.remove();

      if (!grid.children.length) {
        empty.style.display = 'block';
      }
    });

    grid.appendChild(card);
  });
}

/* Carregar Minhas doações  */

function loadMyDonations(user) {
  const grid = document.getElementById('myItemsGrid');
  const empty = document.getElementById('noDonations');

  const items =
    JSON.parse(localStorage.getItem('donationItems')) || [];

  const myItems = items.filter(
    item => item.authorEmail === user.email
  );

  if (myItems.length === 0) {
    empty.style.display = 'block';
    return;
  }

  empty.style.display = 'none';
  grid.innerHTML = '';

  myItems.forEach(item => {
    const card = document.createElement('div');
    card.className = 'item-card';

    const image =
      item.images?.[0] || 'assets/img/placeholder.jpg';

    card.innerHTML = `
      <div class="item-image">
        <img src="${image}" alt="${item.title}">
      </div>

      <div class="item-content">
        <h3>${item.title}</h3>
        <p>${item.category}</p>
        <p>${item.location}</p>
      </div>
    `;

    grid.appendChild(card);
  });
}

// =========================
// CHATS NO PERFIL
// =========================

const chats =
  JSON.parse(localStorage.getItem('chats')) || [];

const chatsList = document.getElementById('chatsList');
const noChats = document.getElementById('noChats');

if (chatsList) {
  const myChats = chats.filter(chat =>
    loggedUser.type === 'ONG'
      ? chat.ongEmail === loggedUser.email
      : chat.userEmail === loggedUser.email
  );

  if (myChats.length === 0) {
    noChats.style.display = 'block';
  } else {
    noChats.style.display = 'none';

    myChats.forEach(chat => {
      const div = document.createElement('div');
      div.className = 'chat-item';

      div.innerHTML = `
        <div>
          <strong>
            ${
              loggedUser.type === 'ONG'
                ? chat.userEmail
                : chat.ongName
            }
          </strong>
          <p class="chat-preview">
            ${
              chat.messages.length
                ? chat.messages.at(-1).text
                : 'Sem mensagens'
            }
          </p>
        </div>

        <button class="btn btn-outline btn-small">
          Abrir
        </button>
      `;

      div.querySelector('button')
        .addEventListener('click', () => {
          window.location.href =
            'chat.html?chatId=' + chat.id;
        });

      chatsList.appendChild(div);
    });
  }
}
