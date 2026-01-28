/**
 * Opens the "Add Contact" dialog if it is not already open and loads the template.
 * setTimeout removes focus from any active element.
 * 
 * @function openAddContactDialog
 * @returns {void} - This function does not return a value.
 */
function openAddContactDialog() {
  const dialog = document.getElementById('addContactDialog');
  if (!dialog.open) {
    dialog.innerHTML = addContactTemplate();
    dialog.showModal();
    setTimeout(() => {
      if (document.activeElement) {
        document.activeElement.blur();
      }
    }, 0);
  }
}


/**
 * Closes the "Add Contact" dialog.
 * Removes its content and resets all contact input fields.
 * 
 * @function closeAddContactDialog
 * @returns {void} - This function does not return a value.
 */
function closeAddContactDialog() {
  const dialog = document.getElementById('addContactDialog');
  if (!dialog) return;
  dialog.close();
  dialog.innerHTML = "";
  renderContactList()
  clearContactInputs();
}


/**
 * Opens the "Edit Contact" dialog if it is not already open and loads the template.
 * setTimeout removes focus from any active element.
 * 
 * @function openEditContactDialog
 * @returns {void} - This function does not return a value.
 */
function openEditContactDialog(id) {
  const dialog = document.getElementById('editContactDialog');
  const selectedContact = contactsArray.find(entry => entry.id == id);
  if (!dialog.open) {
    dialog.innerHTML = editContactTemplate(selectedContact);
    dialog.showModal();
    setTimeout(() => {
      if (document.activeElement) {
        document.activeElement.blur();
      }
    }, 0);
  }
}


/**
 * Updates a contact in Firebase using a PATCH request.
 * 
 * @function updateContactInFirebase
 * @param {string} id - The ID of the contact to update.
 * @param {Object} updatedContact - The updated contact data.
 * @returns {Promise<void>} A promise that resolves when the update is complete.
 */
async function updateContactInFirebase(id, updatedContact) {
  try {
    singleContact = fetch(BASE_URL + "contacts/" + id + ".json", {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedContact),
    });
  } catch (error) {
    console.error("Fehler beim Updaten:", error);
  }
}


/**
 * Updates a contact in the local contacts array by ID.
 * 
 * @function updateContactById
*/
function updateContactById(id, updatedContact) {
  let contactData = contactsArray.find(entry => entry.id == id);
  if (contactData) {
    contactData.name = updatedContact.name;
    contactData.eMail = updatedContact.eMail;
    contactData.phoneNumber = updatedContact.phoneNumber;
    contactsArray.sort((a, b) => a.name.localeCompare(b.name));
  }
}


/**
 * Retrieves updated contact data from input fields and updates the contact in Firebase.
 * 
 * @function getUpdatedContactData
 * @param {string} id - The ID of the contact to update.
 * @returns {Promise<void>} - A promise that resolves when the update is complete.
 */
async function getUpdatedContactData(id) {
  const nameInput = document.getElementById('input-name').value;
  const emailInput = document.getElementById('input-email').value;
  const phoneInput = document.getElementById('input-phone').value;
  const updatedContact = {
    name: nameInput,
    eMail: emailInput,
    phoneNumber: phoneInput,
    initial: getContactInitials(nameInput),
  };
  updateContactById(id, updatedContact);
  return await updateContactInFirebase(id, updatedContact);
}


/**
 * Updates a contact by ID after validating the edit form.
 * Closes the edit dialog, re-renders the contact list and info, and shows a toast notification.
 * 
 * @function updateContact
 * @param {string} id - The ID of the contact to update.
 * @returns {Promise<void>} - A promise that resolves when the update is complete.
 */
async function updateContact(id) {
  if (validateEditContactForm()) {
    validateEditContactForm()
    const contact = contactsArray.find(c => c.id === id);
    const oldName = contact.name;
    const oldMail = contact.eMail;
    const newName = document.getElementById('input-name').value.trim();
    const newMail = document.getElementById('input-email').value.trim();
    await getUpdatedContactData(id);
    if (oldName !== newName) {
      await updateAssigneeInTasksSafe(id, newName);
    }
    if (oldMail !== newMail || oldName !== newName && document.querySelector('myActiveUser') != null) {
      await checkContactInUser(oldName, oldMail, newName, newMail)
    }
    closeEditContactDialog();
    renderLocalContactList();
    renderLocalContactInfo(id);
    showToastUpdate();
    checkActiveUser()
  }
}


/**
 * Displays a toast notification indicating a contact has been updated.
 * The message is shown for 2 seconds before reverting to the creation message.
 * 
 * @function showToastUpdate
 */
function showToastUpdate() {
  const msgBox = document.getElementById('msgBox');
  const overlayElement = document.querySelector('dialog[open]');
  if (overlayElement) {
    overlayElement.appendChild(msgBox);
  } else {
    document.body.appendChild(msgBox);
    msgBox.innerHTML = "Contact updated successfully";
  }
  msgBox.classList.add('show');
  setTimeout(() => {
    msgBox.innerHTML = "Contact successfully created";
    msgBox.classList.remove('show');
  }, 2000);
}


/**
 * Closes the "Edit Contact" dialog.
 * Removes its content and resets all contact input fields.
 * 
 * @function closeEditContactDialog
 * @returns {void} - This function does not return a value.
 */
function closeEditContactDialog() {
  const dialog = document.getElementById('editContactDialog');
  if (!dialog) return;
  dialog.close();
  dialog.innerHTML = "";
  clearContactInputs();
}


/**
 * Clears input fields.
 * 
 * @function clearContactInputs
 * @returns {void} - This function does not return a value.
 */
function clearContactInputs() {
  const inputIds = ["name", "email", "phone"];
  inputIds.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
        element.value = "";
      } else {
        element.innerHTML = "";
      }
    }
  });
}


/**
 * Creates a new contact after validating the form input.
 */
async function createContact() {
  if (validateAddContactForm()) {
    validateAddContactForm()
    await getContactData();
    await showNewContact()
    closeAddContactDialog();
    showToast();
  }
}


/**
 * Renders the contact list and activates the most recently added contact.
 *
 * @async
 * @returns {Promise<void>}
 */
async function showNewContact() {
  await renderContactList()
  const lastContact = contactsList[contactsList.length - 1];
  const element = document.getElementById(lastContact.id)
  setContactActive(lastContact.id, element)
}


/**
 * Validates the "Add Contact" form inputs and enables/disables the submit button.
 * Checks name, email, and phone number validity.
 *
 * @returns {boolean} True if the form is valid, otherwise false.
 */
function validateAddContactForm() {
  const name = document.getElementById('id_contact_name')?.value.trim();
  const email = document.getElementById('id_contact_email')?.value.trim();
  const phone = document.getElementById('id_contact_phone')?.value.trim();
  const isNameValid = name.length >= 2;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPhoneValid = /^[0-9+\s()-]{5,}$/.test(phone);
  const isFormValid = isNameValid && isEmailValid && isPhoneValid;
  handleInputError(isNameValid, isEmailValid, isPhoneValid)
  handleInputErrorMessages(isNameValid, isEmailValid, isPhoneValid)
  return isFormValid;
}


/**
 * Validates the "Edit Contact" form inputs and enables/disables the save button.
 * Checks name, email, and phone number validity.
 *
 * @returns {boolean} True if the form is valid, otherwise false.
 */
function validateEditContactForm() {
  const contactName = document.getElementById('input-name')?.value.trim();
  const contactEmail = document.getElementById('input-email')?.value.trim();
  const contactPhone = document.getElementById('input-phone')?.value.trim();
  const isNameValid = contactName.length >= 2;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail);
  const isPhoneValid = /^[0-9+\s()-]{5,}$/.test(contactPhone);
  const isFormValid = isNameValid && isEmailValid && isPhoneValid;
  handleInputError(isNameValid, isEmailValid, isPhoneValid)
  handleInputErrorMessages(isNameValid, isEmailValid, isPhoneValid)
  return isFormValid;
}


/**
 * Handles the display of input error messages for contact form fields.
 * Shows error messages for empty fields and hides them for valid fields.
 */
function handleInputErrorMessages(name, mail, phone) {
  const nameError = document.getElementById('error_name')
  const emailError = document.getElementById('error_email')
  const phoneError = document.getElementById('error_phone')

  nameError.style.visibility = !name ? "visible" : "hidden"
  emailError.style.visibility = !mail ? "visible" : "hidden"
  phoneError.style.visibility = !phone ? "visible" : "hidden"
}


/**
 * Handles input validation errors by adding or removing error styling from contact form fields.
 * Applies error border styling to both add and edit contact form inputs based on validation state.
 */
function handleInputError(nameinput, mailinput, phoneinput) {
  const addContactName = document.getElementById('id_contact_name') || document.getElementById('input-name')
  const addContactPhone = document.getElementById('id_contact_phone') || document.getElementById('input-phone')
  const addContactEmail = document.getElementById('id_contact_email') || document.getElementById('input-email')
  const errorClass = "error_border"

  if (addContactName) addContactName.classList[nameinput ? "remove" : "add"](errorClass)
  if (addContactEmail) addContactEmail.classList[mailinput ? "remove" : "add"](errorClass)
  if (addContactPhone) addContactPhone.classList[phoneinput ? "remove" : "add"](errorClass)
}
