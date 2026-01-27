(() => {
  const accountButtons = document.querySelectorAll('.auth-form .btn-outline');
  const ngoFields = document.querySelector('.ngo-fields');
  const fullNameField = document.querySelector('.full-name-field');
  const form = document.querySelector('.auth-form');

  // Criar / obter input hidden do tipo de conta
  let accountTypeInput = document.getElementById('accountType');
  if (!accountTypeInput) {
    accountTypeInput = document.createElement('input');
    accountTypeInput.type = 'hidden';
    accountTypeInput.id = 'accountType';
    accountTypeInput.value = 'individual';
    form.appendChild(accountTypeInput);
  }

  // Alternar Individual / ONG
  accountButtons.forEach(button => {
    button.addEventListener('click', () => {
      accountButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const isNGO = button.textContent.trim() === 'ONG';
      accountTypeInput.value = isNGO ? 'ong' : 'individual';

      if (ngoFields) {
        ngoFields.style.display = isNGO ? 'block' : 'none';
        ngoFields.querySelectorAll('input').forEach(input => {
          input.required = isNGO;
        });
      }

      if (fullNameField) {
        fullNameField.style.display = isNGO ? 'none' : 'block';
        const nameInput = fullNameField.querySelector('input');
        if (nameInput) nameInput.required = !isNGO;
      }
    });
  });

  // Validação do formulário
  if (form) {
    form.addEventListener('submit', event => {
      if (form) {
    form.addEventListener('submit', event => {
      event.preventDefault();

      let valid = true;
      const requiredFields = form.querySelectorAll('input[required]');

      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          field.classList.add('input-error');
          valid = false;
        } else {
          field.classList.remove('input-error');
        }
      });

      const password = form.querySelector('input[name="password"]');
      const confirmPassword = form.querySelector('input[name="confirm_password"]');

      if (password && confirmPassword && password.value !== confirmPassword.value) {
        confirmPassword.classList.add('input-error');
        valid = false;
      }

      if (valid) {
        form.submit(); // aqui o auth.js entra
      }
    });
  }
})
  };

})();
