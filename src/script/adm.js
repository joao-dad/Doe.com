const loggedUser = getLoggedUser();

// SEGURANÇA
if (!loggedUser || loggedUser.type !== 'Admin') {
  alert('Acesso restrito.');
  window.location.href = 'index.html';
}


//Mostra users cadastrados
function loadUsers() {
  const users = getUsers();
  const tbody = document.getElementById('usersTable');
  tbody.innerHTML = '';

  users.forEach(user => {
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${user.name || user.organizationName || '-'}</td>
      <td>${user.email}</td>
      <td>${user.type}</td>
      <td>
        ${
          user.type !== 'Admin'
            ? `<button class="admin-btn delete" onclick="deleteUser('${user.email}')">Eliminar</button>`
            : '—'
        }
      </td>
    `;

    tbody.appendChild(tr);
  });
}

//apaga users cadastrados
function deleteUser(email) {
  if (!confirm('Tem certeza que deseja eliminar este usuário?')) return;

  let users = getUsers();
  users = users.filter(u => u.email !== email);
  saveUsers(users);

  alert('Usuário eliminado.');
  loadUsers();
}

//mostra posts
function loadRequests() {
  const requests = getDonationRequests();

  const tbody = document.getElementById('postsTable');
  tbody.innerHTML = '';

  if (requests.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5">Nenhuma publicação encontrada</td>
      </tr>
    `;
    return;
  }

  requests.forEach(req => {
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${req.title}</td>
      <td>${req.ongName}</td>
      <td>${req.ongNif || '—'}</td>
      <td>${req.description}</td>
      <td>
        <button class="admin-btn delete" onclick="deleteRequest(${req.id})">
          Eliminar
        </button>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

//apaga posts
function deleteRequest(id) {
  if (!confirm('Eliminar este pedido?')) return;

  let requests = getDonationRequests();

  requests = requests.filter(r => r.id !== id);

  saveDonationRequests(requests);

  loadRequests();
}

//chama as funções
document.addEventListener('DOMContentLoaded', () => {
  loadUsers();     
  loadRequests();  
});

