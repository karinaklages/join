function goToSignup() { window.location.href = "sign_up.html"; }
function guestLogin() { window.location.href = "summary.html"; }


/**
 * Returns commonly used user-related DOM elements.
 */
function getElementsUser() {
  return {
    checkbox: document.querySelector('.checkbox_row input[type="checkbox"]'),
    btn: document.getElementById('signup_btn'),
    name: document.getElementById('auth_input_name'),
    email: document.getElementById('auth_input_mail'),
    pass: document.getElementById('auth_password_input'),
    confirm: document.getElementById('auth_confirm_password_input'),
    errorMsg: document.getElementById('confirm_password_error'),
    emailError: document.getElementById('email_error')
  };
}


/**
 * Toggles the visibility of a password input and updates the icon.
 * @param {HTMLInputElement} input - The input element (password field).
 * @param {HTMLImageElement} icon - The icon element to update.
 */
function toggleIconState(input, icon) {
  if (input.value.length === 0) return;
  const isPass = input.type === 'password';
  input.type = isPass ? 'text' : 'password';
  icon.src = isPass ? ICONS.ON : ICONS.OFF;
}


/**
 * Updates the icon based on input value.
 * Shows lock icon if input is empty. Shows unlock icon if input has text.
 * 
 * @param {HTMLInputElement} input - The input element.
 * @param {HTMLImageElement} icon - The icon element to update.
 */
function updateIconOnInput(input, icon) {
  if (input.value.length > 0) {
    if (icon.src.includes('lock_icon')) {
      icon.src = ICONS.OFF;
      input.type = 'password';
    }
  } else {
    icon.src = ICONS.LOCK;
    input.type = 'password';
  }
}


/**
 * Initializes password toggle functionality for a given input and icon.
 * @param {string} inputId - The ID of the password input.
 * @param {string} iconId - The ID of the toggle icon.
 */
function setupToggle(inputId, iconId) {
  const input = document.getElementById(inputId);
  const icon = document.getElementById(iconId);
  if (!input || !icon) return;
  input.addEventListener('input', () => updateIconOnInput(input, icon));
  icon.addEventListener('click', (e) => {
    e.preventDefault();
    toggleIconState(input, icon);
  });
}


/**
 * Checks if the email format matches pattern: something@domain.tld
 * Requires a dot and at least 2 characters at the end (e.g., .de, .com)
 */
function checkEmailFormat(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}


/**
 * Checks if all required form fields are valid.
 * @param {Object} els - Object containing form elements.
 * @param {HTMLInputElement} els.name - Name input field.
 * @param {HTMLInputElement} els.email - Email input field.
 * @param {HTMLInputElement} els.pass - Password input field.
 * @param {HTMLInputElement} els.confirm - Password confirmation input field.
 * @param {HTMLInputElement} els.checkbox - Agreement checkbox.
 * @returns {boolean} True if all fields are valid, false otherwise.
 */
function isValid(els) {
  return (
    els.name.value.trim() !== '' &&
    checkEmailFormat(els.email.value) &&
    els.pass.value.length > 0 &&
    els.pass.value === els.confirm.value &&
    els.checkbox.checked
  );
}


/**
 * Updates the state and style of the submit button based on form validity.
 * @param {Object} els - Object containing form elements including the button.
 * @param {HTMLButtonElement} els.btn - The submit button.
 */
function updateBtn(els) {
  const valid = isValid(els);
  els.btn.disabled = !valid;
  if (valid) {
    els.btn.style.backgroundColor = '#2a3647';
    els.btn.style.color = 'white';
    els.btn.style.cursor = 'pointer';
  } else {
    els.btn.style.backgroundColor = '#999';
    els.btn.style.color = '#eee';
    els.btn.style.cursor = 'not-allowed';
  }
}


/**
  * Checks email validity and displays an error message if necessary.
 */
function handleEmailValidation(els) {
  const emailValue = els.email.value;
  if (emailValue.length > 0 && !checkEmailFormat(emailValue)) {
    els.email.classList.add('input_error');
    els.emailError.style.display = 'block';
  } else {
    els.email.classList.remove('input_error');
    els.emailError.style.display = 'none';
  }
  updateBtn(els);
}


/**
 * Checks if the password and confirmation match and shows error if not.
 */
function handlePasswordMatch(els) {
  const password = els.pass.value;
  const confirm = els.confirm.value;
  const isMatchStarting = password.startsWith(confirm);
  const isFullMatch = password === confirm;
  if (!isMatchStarting || (password.length === confirm.length && !isFullMatch)) {
    if (confirm.length > 0) {
      els.confirm.classList.add('error');
      els.errorMsg.style.display = 'block';
      els.errorMsg.textContent = "Your passwords don't match.";
    }
  } else {
    els.confirm.classList.remove('error');
    els.errorMsg.style.display = 'none';
  }
  updateBtn(els);
}


/**
 * Adds basic input listeners for name, email, and checkbox to update the submit button.
 */
function addBasicListeners(els) {
  const check = () => updateBtn(els);
  els.name.addEventListener('input', check);
  els.checkbox.addEventListener('change', check);
  els.email.addEventListener('input', () => {
    els.email.classList.remove('input_error');
    els.emailError.style.display = 'none';
    updateBtn(els);
  });
  els.email.addEventListener('blur', () => {
    handleEmailValidation(els);
  });
}


/**
 * Adds input listeners to password and confirmation fields to handle matching logic.
 */
function addPasswordListeners(els) {
  els.confirm.addEventListener('input', () => {
    handlePasswordMatch(els);
  });
  els.pass.addEventListener('input', () => {
    handlePasswordMatch(els);
  });
}


/**
 * Initializes the signup form.
 */
function initSignupForm() {
  const els = getElementsUser();
  if (!els.btn || !els.pass) return;
  setupToggle('auth_password_input', 'toggle_password_icon');
  setupToggle('auth_confirm_password_input', 'toggle_confirm_password_icon');
  addBasicListeners(els);
  addPasswordListeners(els);
  updateBtn(els);
}


/**
 * Handles the signup button click:
 * Prevents default form submission.
 * Sends user data to storage. Shows a confirmation toast.
 * Redirects to home page after 2 seconds.
 */
initSignupForm();
document.getElementById('signup_btn').addEventListener("click", async function (event) {
  event.preventDefault();
  await getUserData();
  showToast();
  setTimeout(() => {
    window.location.href = "index.html";
  }, 2000);
});


/**
 * Stores user data in persistent storage.
 */
async function switchUserData(userName, userEmail, userColor, elements, userPassword, userInitials) {
  let userData = {
    "name": userName,
    "eMail": userEmail,
    "password": userPassword,
    "color": userColor,
    "initial": userInitials
  }
  await postToStorage("user", userData, elements);
}