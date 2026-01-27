


// Helpers

function getLoggedUser() {
  const user = localStorage.getItem('loggedUser');
  return user ? JSON.parse(user) : null;
}

function getRequests() {
  return JSON.parse(localStorage.getItem('donationRequests')) || [];
}

function saveRequests(requests) {
  localStorage.setItem('donationRequests', JSON.stringify(requests));
}

function getCurrentDate() {
  return new Date().toLocaleDateString('pt-PT');
}


// Formulário de pedido (ONG)

const donationForm = document.getElementById('requestForm');

if (donationForm) {
  donationForm.addEventListener('submit', event => {
    event.preventDefault();

    const user = getLoggedUser();

    if (!user || user.type !== 'ONG') {
      alert('Apenas ONGs podem criar pedidos.');
      return;
    }

    const title = donationForm.querySelector('[name="title"]').value.trim();
    const description = donationForm.querySelector('[name="description"]').value.trim();
    const category = donationForm.querySelector('[name="category"]').value;
    const location = donationForm.querySelector('[name="location"]').value.trim();
  

    const priorityInput = donationForm.querySelector(
      'input[name="priority"]:checked'
    );
    const priority = priorityInput ? priorityInput.value : 'Normal';

    if (!title || !description || !category || !location) {
      alert('Preencha todos os campos obrigatórios.');
      return;
    }

    const newRequest = {
      id: Date.now(),
      title,
      description,
      category,
      location,
      priority,
      images: [],
      ongId: user.id,
      ongName: user.organizationName,
      ongEmail: user.email,
      ongNif: user.nif,
      date: getCurrentDate()
    };

    const requests = getRequests();
    requests.push(newRequest);
    saveRequests(requests);

    donationForm.reset();

    alert('Pedido publicado com sucesso!');
    window.location.href = 'perfil.html';
  });
}


/*separa quem vê o quê */

document.addEventListener('DOMContentLoaded', () => {
  const user = JSON.parse(localStorage.getItem('loggedUser'));

  const formSection = document.getElementById('requestFormSection');
  const listSection = document.getElementById('requestsListSection');

  if (!user) {
    window.location.href = 'login.html';
    return;
  }

  // ONG → cria pedidos
  if (user.type === 'ONG') {
    formSection.style.display = 'block';
    listSection.style.display = 'none';
    return;
  }

  // INDIVIDUAL → apenas visualiza pedidos
  formSection.style.display = 'none';
  listSection.style.display = 'block';

  loadRequests();
});


/*mostra pedidos para individual */

function loadRequests() {
  const grid = document.getElementById('requestsGrid');
  const empty = document.getElementById('emptyRequests');

  const requests =
    JSON.parse(localStorage.getItem('donationRequests')) || [];

  if (requests.length === 0) {
    empty.style.display = 'block';
    return;
  }

  empty.style.display = 'none';

  requests.forEach(request => {
    const card = document.createElement('div');
    card.className = 'item-card';

    card.innerHTML = `
      <img
        src="${request.images?.[0] || 'assets/img/placeholder.jpg'}"
        alt="${request.title}"
      />

      <div class="item-content">
        <h3>${request.title}</h3>
        <p class="item-category">${request.category}</p>
        <p class="item-location">${request.location}</p>

        <button class="btn btn-outline btn-small">
          Quero ajudar
        </button>
      </div>
    `;

    card.querySelector('button').addEventListener('click', () => {
  openHelpModal(request);
});

    grid.appendChild(card);
  });
}

/*função do modal */

function openHelpModal(request) {
  const modal = document.getElementById('helpModal');

  document.getElementById('modalTitle').textContent =
    request.title;

  document.getElementById('modalDescription').textContent =
    request.description;

  document.getElementById('modalOng').textContent =
    request.ongName;

  document.getElementById('modalEmail').textContent =
    request.ongEmail;

  document.getElementById('modalNif').textContent =
    request.ongNif || '—';

  const contactBtn = document.getElementById('contactBtn');

  // remove qualquer evento antigo
  contactBtn.onclick = null;

  contactBtn.onclick = () => {
    startChat(request);
  };

  modal.style.display = 'flex';
}

  /* abrir chat */
 function startChat(request) {
  const loggedUser = getLoggedUser();

  if (!loggedUser) {
    alert('Precisa estar logado.');
    return;
  }

  let chats =
    JSON.parse(localStorage.getItem('chats')) || [];

  let chat = chats.find(
    c =>
      c.requestId === request.id &&
      c.userEmail === loggedUser.email
  );

  if (!chat) {
    chat = {
      id: Date.now().toString(),
      requestId: request.id,
      ongName: request.ongName,
      ongEmail: request.ongEmail,
      ongNif: request.ongNif,
      userName: loggedUser.name,
      userEmail: loggedUser.email,
      messages: []
    };

    chats.push(chat);
    localStorage.setItem('chats', JSON.stringify(chats));
  }

  console.log('CHAT OK:', chat);

  //  REDIRECIONAMENTO COM CHAT JÁ DEFINIDO
  window.location.href = `chat.html?chatId=${chat.id}`;
}


/*fecha modal */
document.getElementById('closeModal').onclick = () => {
  document.getElementById('helpModal').style.display = 'none';
};


  
