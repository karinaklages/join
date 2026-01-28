const lockIconPath = "./assets/img/lock_icon.svg";
const noVisibilityIconPath = "./assets/img/visibility_off.svg";
const visibilityIconPath = "./assets/img/visibility.svg";


/**
 * Redirects the user to the signup page.
 */
function goToSignup() {
  window.location.href = "sign_up.html";
}


/**
 * Logs in a guest user:
 * Stores a default guest user object in localStorage.
 * Flags a mobile greeting to show.
 * Redirects to the summary page.
 */
function guestLogin() {
  let guestUser = {
    name: "Guest",
    email: "guest@guest.com",
    initials: "G",
  };
  localStorage.setItem("activeUser", JSON.stringify(guestUser));
  localStorage.setItem("showMobileGreeting", "true");
  window.location.href = "summary.html";
}


/**
 * Toggles the visibility of a password input field and updates the associated icon. Does nothing if the input is empty.
 * @param {HTMLInputElement} passwordInput - The password input field to toggle.
 * @param {HTMLImageElement} toggleIcon - The icon element that indicates visibility state.
 */
function toggleVisibilityState(passwordInput, toggleIcon) {
  if (passwordInput.value.length === 0) return;
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    toggleIcon.src = visibilityIconPath;
  } else {
    passwordInput.type = "password";
    toggleIcon.src = noVisibilityIconPath;
  }
}


/**
 * Updates the visibility icon and input type based on password input value.
 * @param {HTMLInputElement} passwordInput - The password input field.
 * @param {HTMLImageElement} toggleIcon - The icon element to update.
 */
function handlePasswordInput(passwordInput, toggleIcon) {
  if (passwordInput.value.length > 0) {
    if (toggleIcon.src.includes("lock_icon")) {
      toggleIcon.src = noVisibilityIconPath;
      passwordInput.type = "password";
    }
  } else {
    toggleIcon.src = lockIconPath;
    passwordInput.type = "password";
  }
  if (typeof updateSignupButtonState === "function") {
    updateSignupButtonState();
  }
}


/**
 * Sets up password visibility toggle functionality for a given input and icon.
 * Updates the icon and input type on input changes. Toggles visibility when the icon is clicked.
 * @param {string} passwordId - The ID of the password input field.
 * @param {string} toggleIconId - The ID of the toggle icon element.
 */
function setupPasswordToggle(passwordId, toggleIconId) {
  const passwordInput = document.getElementById(passwordId);
  const toggleIcon = document.getElementById(toggleIconId);
  if (!passwordInput || !toggleIcon) return;
  passwordInput.addEventListener("input", () => {
    handlePasswordInput(passwordInput, toggleIcon);
  });
  toggleIcon.addEventListener("click", (event) => {
    event.preventDefault();
    toggleVisibilityState(passwordInput, toggleIcon);
  });
}


/**
 * Initializes password toggles.
 */
setupPasswordToggle("auth_password_input", "toggle_password_icon");
setupPasswordToggle(
  "auth_confirm_password_input",
  "toggle_confirm_password_icon"
);


/**
 * Handles user login.
 * Retrieves email and password from input fields.
 * Fails gracefully if either input is missing.
 * Attempts to process the login asynchronously.
 * Logs an error if the login process fails.
 */
async function login() {
  let { email, password } = getLoginInputs();
  if (!email || !password) {
    handleLoginFail();
    return;
  }
  try {
    await processLogin(email, password);
  } catch (error) {
  }
}


/**
 * Processes user login by validating credentials against stored users.
 * Fetches the list of users asynchronously.
 * Finds a user matching the given email and password.
 * Calls `handleLoginSuccess` if a match is found.
 * Calls `handleLoginFail` if no match is found or database is empty.
 * @param {string} email - The email input from the user.
 * @param {string} password - The password input from the user.
 */
async function processLogin(email, password) {
  let usersResponse = await fetchUsers();
  if (!usersResponse) {
    return;
  }
  let user = findUserByCredentials(usersResponse, email, password);
  if (user) {
    handleLoginSuccess(user);
  } else {
    handleLoginFail();
  }
}


/**
 * Retrieves the current values of the login input fields.
 * @returns {Object} An object containing:
 * - email: The value of the email input field.
 * - password: The value of the password input field.
 */
function getLoginInputs() {
  return {
    email: document.getElementById("auth_input_mail").value,
    password: document.getElementById("auth_password_input").value,
  };
}


/**
 * Fetches all users from the backend asynchronously.
 * @async
 * @returns {Promise<Object|null>} A JSON object containing all users, or null if the fetch fails.
 */
async function fetchUsers() {
  try {
    let response = await fetch(BASE_URL + "user.json");
    return await response.json();
  } catch (error) {
    console.error("Fehler beim Updaten:", error);
  }
}


/**
 * Finds a user object from the response that matches the given email and password.
 * @param {Object} usersResponse - The object containing all users from the backend.
 * @param {string} email - The email to match.
 * @param {string} password - The password to match.
 * @returns {Object|null} The matching user object if found, otherwise null.
 */
function findUserByCredentials(usersResponse, email, password) {
  for (let key in usersResponse) {
    let user = usersResponse[key];
    if (user.eMail === email && user.password === password) {
      return user;
    }
  }
  return null;
}


/**
 * Handles a successful login:
 * Stores the active user in localStorage.
 * Flags mobile greeting display.
 * Redirects the user to the summary page.
 * @param {Object} user - The user object returned from the backend.
 */
function handleLoginSuccess(user) {
  let activeUser = {
    name: user.name,
    email: user.eMail,
    initials: getInitials(user.name),
    color: user.color,
  };
  localStorage.setItem("activeUser", JSON.stringify(activeUser));
  localStorage.setItem("showMobileGreeting", "true");
  window.location.href = "summary.html";
}


/**
 * Handles a failed login attempt:
 * Adds error styling to email and password input fields. Displays the login error message element.
 */
function handleLoginFail() {
  let emailInput = document.getElementById("auth_input_mail");
  let passwordInput = document.getElementById("auth_password_input");
  let errorMessage = document.getElementById("login_error_message");
  emailInput.classList.add("input_error");
  passwordInput.classList.add("input_error");
  errorMessage.style.display = "block";
}


/**
 * Resets the login error state:
 * Removes error styling from email and password input fields if present.
 * Hides the login error message element.
 */
function resetLoginError() {
  let emailInput = document.getElementById("auth_input_mail");
  let passwordInput = document.getElementById("auth_password_input");
  let errorMessage = document.getElementById("login_error_message");
  if (
    emailInput.classList.contains("input_error") || passwordInput.classList.contains("input_error")
  ) {
    emailInput.classList.remove("input_error");
    passwordInput.classList.remove("input_error");
    errorMessage.style.display = "none";
  }
}


/**
 * Returns the initials of a given name.
 * If the name has only one word, returns the first letter.
 * If the name has multiple words, returns the first letters of the first two words.
 * Converts initials to uppercase.
 * @param {string} name - The full name of the user.
 * @returns {string} - The initials of the name.
 */
function getInitials(name) {
  if (!name) return "";
  let parts = name.split(" ");
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  } else {
    return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
  }
}