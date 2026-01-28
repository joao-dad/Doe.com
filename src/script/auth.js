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


// =============================
// AUTENTICAÇÃO (Signup + Login)
// =============================

// Helpers ---------------------
function getUsers() {
  const users = localStorage.getItem('users');
  return users ? JSON.parse(users) : [];
}

function saveUsers(users) {
  localStorage.setItem('users', JSON.stringify(users));
}

function getLoggedUser() {
  const user = localStorage.getItem('loggedUser');
  return user ? JSON.parse(user) : null;
}

function setLoggedUser(user) {
  localStorage.setItem('loggedUser', JSON.stringify(user));
}

// =============================
// SIGNUP (Criar Conta)
// =============================
const signupForm = document.getElementById('signupForm');

if (signupForm) {
  signupForm.addEventListener('submit', event => {
    event.preventDefault();

    const accountTypeBtn = document.querySelector('.btn-outline.active');
    const type = accountTypeBtn ? accountTypeBtn.textContent.trim() : 'Individual';

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

    const emailExists = users.some(user => user.email === email);
    if (emailExists) {
      alert('Este email já está registado.');
      return;
    }

    let newUser = {
      id: Date.now(),
      email,
      password,
      location,
      type
    };

    if (type === 'ONG') {
      newUser.organizationName = signupForm.nameONG.value.trim();
      newUser.nif = signupForm.nif.value.trim();
      newUser.area = signupForm.area.value.trim();
    } else {
      newUser.name = signupForm.nome.value.trim();
    }

    users.push(newUser);
    saveUsers(users);

    alert('Conta criada com sucesso! Agora faça login.');
    window.location.href = 'login.html';
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

    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      alert('Email ou palavra-passe incorretos.');
      return;
    }

    setLoggedUser(user);

    alert('Login efetuado com sucesso!');
    window.location.href = 'index.html';
  });
}

  // Logout
  logoutBtn.addEventListener('click', () => {
    const confirmLogout = confirm(
      'Tem a certeza que deseja terminar a sessão?'
    );

    if (!confirmLogout) return;

    localStorage.removeItem('loggedUser');
    window.location.href = 'login.html';
  });
