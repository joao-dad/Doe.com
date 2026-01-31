// =============================
// HELPERS
// =============================
function getUsers() {
  return JSON.parse(localStorage.getItem('users')) || [];
}

function saveUsers(users) {
  localStorage.setItem('users', JSON.stringify(users));
}

function getLoggedUser() {
  return JSON.parse(localStorage.getItem('loggedUser'));
}

function setLoggedUser(user) {
  localStorage.setItem('loggedUser', JSON.stringify(user));
}

// =============================
// ADMIN FIXO
// =============================
const ADMIN_ACCOUNT = {
  id: 'admin-1',
  email: 'adm@gmail.com',
  password: '123',
  type: 'Admin',
  name: 'Administrador'
};

function ensureAdminExists() {
  const users = getUsers();

  const adminExists = users.some(
    u => u.email === ADMIN_ACCOUNT.email
  );

  if (!adminExists) {
    users.push(ADMIN_ACCOUNT);
    saveUsers(users);
    console.log(' Admin criado automaticamente');
  }
}

ensureAdminExists();


// =============================
// SIGNUP (Criar Conta)
// =============================
let selectedAccountType = 'Individual';

const signupForm = document.getElementById('signupForm');
const typeButtons = document.querySelectorAll('.account-type .btn-outline');

const ongFields = document.getElementById('ongFields');

function toggleAccountType(type) {
  if (!ongFields) return;

  const nameONG = signupForm.nameONG;
  const nif = signupForm.nif;
  const area = signupForm.area;

  if (type === 'ONG') {
    ongFields.style.display = 'block';
    nameONG.required = true;
    nif.required = true;
    area.required = true;
  } else {
    ongFields.style.display = 'none';
    nameONG.required = false;
    nif.required = false;
    area.required = false;

    nameONG.value = '';
    nif.value = '';
    area.value = '';
  }
}

// BOTÕES TIPO DE CONTA
typeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    typeButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    selectedAccountType = btn.dataset.type;
    toggleAccountType(selectedAccountType);
  });
});

// ESTADO INICIAL
toggleAccountType(selectedAccountType);

// SUBMIT
if (signupForm) {
  signupForm.addEventListener('submit', e => {
    e.preventDefault();

    const email = signupForm.email.value.trim();
    const password = signupForm.password.value;
    const confirmPassword = signupForm.confirm_password.value;
    const location = signupForm.localiza.value.trim();

    if (!email || !password || !confirmPassword) {
      alert('Preencha todos os campos obrigatórios.');
      return;
    }

    if (password !== confirmPassword) {
      alert('As palavras-passe não coincidem.');
      return;
    }

    const users = getUsers();

    if (users.some(u => u.email === email)) {
      alert('Este email já está registado.');
      return;
    }

    let newUser = {
      id: Date.now(),
      email,
      password,
      location,
      type: selectedAccountType
    };

    if (selectedAccountType === 'ONG') {
      newUser.organizationName = signupForm.nameONG.value.trim();
      newUser.nif = signupForm.nif.value.trim();
      newUser.area = signupForm.area.value.trim();
    } else {
      newUser.name = signupForm.nome.value.trim();
    }

    users.push(newUser);
    saveUsers(users);

    alert('Conta criada com sucesso! Agora faça login.');
    window.location.href = 'index.html';
  });
}


// =============================
// LOGIN
// =============================
const loginForm = document.getElementById('loginForm');

if (loginForm) {
  loginForm.addEventListener('submit', event => {
    event.preventDefault();

    const email = loginForm.email.value.trim();
    const password = loginForm.password.value;

    const users = getUsers();

    console.log('USERS:', users); // DEBUG
    console.log('LOGIN:', email, password);

    const user = users.find(
      u => u.email === email && u.password === password
    );

    if (!user) {
      alert('Email ou palavra-passe incorretos.');
      return;
    }

    setLoggedUser(user);

    if (user.type === 'Admin') {
      window.location.href = 'adm.html';
    } else {
      window.location.href = 'home.html';
    }
  });
}
