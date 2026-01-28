const subtaskInput = document.getElementById("subtasks");
const subtaskInputEdit = document.getElementById("subtasks_edit");
const subtaskList = document.getElementById("subtaskList");
const subtaskListEdit = document.getElementById("subtaskList_edit");
const subtaskActions = document.querySelector(".subtask_actions");

let selectedAssignees = [];
let selectedAssigneesEdit = [];


/**
 * Checks whether the contact list is already loaded and loads it if necessary.
 * If the contacts are not yet available, data is fetched from Firebase before displaying the contacts in the task view.
 *
 * @async
 * @function checkContactList
 * @param {string} element - The element identifier used to determine which list to check.
 * @returns {Promise<void>} - A promise that resolves when the contact list has been checked and rendered.
 */
async function checkContactList(element, HTMLid) {
  if (element == "contacts" && contactsList.length > 0) {
    showContactsInTasks(HTMLid);
    return;
  }
  await loadFirebaseData("contacts");
  showContactsInTasks(HTMLid);
}



/**
 * Toggles the selection state of a contact checkbox in the UI.
 * Updates the `selectedAssignees` array and refreshes the assigned contacts display.
 *
 * @param {HTMLImageElement} imgElement - The checkbox image element to toggle.
 * @param {number} index - The index of the contact in the `contactsList` array.
 */
function toggleCheckedIcon(imgElement, index, elementId) {
  const contact = contactsList[index];
  const contactId = contact.id;
  const arrayOfElements = Array.from(imgElement)
  const isChecked = arrayOfElements[0].children[1].dataset.checked === "true";
  let assigneeList = elementId === "default" ? selectedAssignees : selectedAssigneesEdit;
  if (isChecked) {
    assigneeList = assigneeList.filter(c => c.id !== contactId);
    arrayOfElements[0].children[1].dataset.checked = "false";
    arrayOfElements[0].children[1].src = "./assets/img/checkbox_unchecked.svg";
  } else {
    if (!assigneeList.some(c => c.id === contactId)) {
      assigneeList.push(contact);
    }
    arrayOfElements[0].children[1].dataset.checked = "true";
    arrayOfElements[0].children[1].src = "./assets/img/checkbox_checked.svg";
  }
  if (elementId === "default") {
    selectedAssignees = assigneeList;
  } else {
    selectedAssigneesEdit = assigneeList;
  }
  renderAssignedContacts(elementId);
}


/**
 * Main function to prepare data and container for rendering assignees.
 * Selects the correct list and clears the container before rendering.
 */
function renderAssignedContacts(elementId) {
  const container = document.getElementById("assigned_contacts_row_" + elementId);
  container.innerHTML = "";
  let assigneeList = elementId === "default" ? selectedAssignees : selectedAssigneesEdit;
  renderAssigneeBubbles(container, assigneeList);
}


/**
 * Renders the visible assignee bubbles and the overflow counter if necessary.
 * Limits the display to 5 contacts.
 * 
 * @param {HTMLElement} container - The DOM element to append bubbles to.
 * @param {Array} assigneeList - The list of selected assignees.
 */
function renderAssigneeBubbles(container, assigneeList) {
  const maxVisible = 4;
  const totalAssignees = assigneeList.length;
  const renderCount = Math.min(totalAssignees, maxVisible);
  for (let i = 0; i < renderCount; i++) {
    const contact = assigneeList[i];
    container.innerHTML += `
      <div class="contact_initial_circle assigned_contact" data-assignee-id="${contact.id}" title="${contact.contact.name}" style="background-color:${contact.contact.color}">${contact.contact.initial}</div>
    `;
  }
  if (totalAssignees > maxVisible) {
    const extraCount = totalAssignees - maxVisible;
    container.innerHTML += `
      <div class="contact_initial_circle assigned_contact" style="background-color: #29abe2; color: white;">+${extraCount}</div>
    `;
  }
}


/**
 * Synchronizes the checkbox icons in the dropdown list with the current selection.
 * Ensures that each dropdown item accurately reflects whether the corresponding contact is selected.
 */
function syncDropdownCheckboxes(elementId) {
  document.querySelectorAll(".dropdown_item_user").forEach(item => {
    const id = item.dataset.assigneeId;
    const checkbox = item.querySelector(".checkbox_icon");
    let assigneeList = elementId === "default" ? selectedAssignees : selectedAssigneesEdit;
    const checked = assigneeList.some(c => c.id == id);
    checkbox.dataset.checked = checked;
    checkbox.src = checked ? "./assets/img/checkbox_checked.svg" : "./assets/img/checkbox_unchecked.svg";
  });
}


/**
 * Clears all selected assignees and resets their checkbox icons in the UI.
 * Empties the `selectedAssignees` array, unchecks all checkboxes, and clears the assigned contacts display.
 */
function clearSelectedAssignees() {
  selectedAssignees = [];
  document.querySelectorAll(".checkbox_icon").forEach((checkbox) => {
    checkbox.dataset.checked = "false";
    checkbox.src = "./assets/img/checkbox_unchecked.svg";
  });
  const assignedContainer = document.getElementById("assigned_contacts_row");
  if (assignedContainer) {
    assignedContainer.innerHTML = "";
  }
}


/**
 * Renders the contact list in the task assignment dropdown.
 * Clears the current list and dynamically creates list items for each contact, including their checked state and corresponding icon.
 *
 * @function showContactsInTasks
 * @returns {void} - This function does not return a value.
 */
function showContactsInTasks(HTMLid) {
  let assigneeList = document.getElementById("contacts_list_task_" + HTMLid);
  assigneeList.innerHTML = "";
  for (let index = 0; index < contactsList.length; index++) {
    isChecked = contactsList[index].isChecked === true;
    const checkImg = isChecked ? "./assets/img/checkbox_checked_contact_form.svg" : "./assets/img/checkbox_unchecked_contact_form.svg";
    const checkState = isChecked ? "true" : "false";
    const listElement = document.createElement("li");
    listElement.className = "dropdown_item";
    listElement.onclick = function () { toggleCheckedIcon(this.children, index, HTMLid) }
    listElement.innerHTML = listAssigneeTemplate(contactsList, index, checkImg, checkState, HTMLid);
    assigneeList.appendChild(listElement);
  }
}


/**
 * Shows the subtask action buttons and sets the display style to flex.
 *
 * @function showSubtaskActions
 * @returns {void} - This function does not return a value.
 */
function showSubtaskActions() {
  if (subtaskActions) subtaskActions.style.display = "flex";
}


/**
 * Cancels the current subtask input.
 * Clears the input field, hides the subtask action buttons and resets the currently edited item.
 *
 * @function cancelSubtask
 * @returns {void} - This function does not return a value.
 */
function cancelSubtask() {
  if (subtaskInput) subtaskInput.value = "";
  if (subtaskInputEdit) subtaskInputEdit.value = "";
  if (subtaskActions) subtaskActions.style.display = "none";
  showSubtaskActions();
}


/**
 * Adds a new subtask to the subtask list.
 * Reads the trimmed value from the subtask input field, creates a new list item using the subtask template, and appends it to the subtask list.
 * After adding the subtask, the input field and related UI elements are reset.
 *
 * @function addSubtask
 * @returns {void} This function does not return a value.
 */
function addSubtask() {
  const inputSubtask = document.getElementById("subtasks");
  const inputSubtaskEdit = document.getElementById("subtasks_edit")
  const subtaskList = document.getElementById("subtaskList");
  const subtaskListEdit = document.getElementById("subtaskList_edit")
  const input = inputSubtaskEdit?.value.trim() ? inputSubtaskEdit : inputSubtask;
  const list = input === inputSubtaskEdit ? subtaskListEdit : subtaskList;
  if (!input || !list) return;
  const value = input.value.trim();
  if (!value) return;
  const li = document.createElement("li");
  li.className = "list_element";
  li.innerHTML = listSubtaskTemplate(value);
  list.appendChild(li);
  input.value = "";
  cancelSubtask();
}


/**
 * Enables edit mode for a subtask.
 *
 * @param {HTMLElement} btn - The button that triggers editing.
 */
function editSubtask(btn) {
  const li = btn.closest("li");
  li.querySelector(".edit_container").style.display = "block";
  li.querySelector(".list_row").style.display = "none";
}


/**
 * Saves the changes made to a subtask.
 *
 * @param {HTMLElement} btn - The button that triggers saving.
 */
function saveEdit(btn) {
  const li = btn.closest("li");
  const newValue = li.querySelector(".subtask_edit_input").value;
  li.querySelector(".subtask_text").innerText = newValue;
  li.querySelector(".edit_container").style.display = "none";
  li.querySelector(".list_row").style.display = "flex";
}


/**
 * Cancels the edit mode and restores the original subtask display.
 *
 * @param {HTMLElement} btn - The button that triggers canceling.
 */
function cancelEdit(btn) {
  const li = btn.closest("li");
  li.querySelector(".edit_container").style.display = "none";
  li.querySelector(".list_row").style.display = "flex";
}


/**
 * Listens for the "Enter" key on the Subtask input field.
 * Prevents the default form submission behavior and calls `addSubtask()` when Enter is pressed.
 *
 * @param {KeyboardEvent} event - The keyboard event triggered on keydown.
 */
subtaskInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    addSubtask();
  }
});


/**
 * Listens for the "Enter" key on the Subtask Edit input field.
 * Prevents the default form submission behavior and calls `addSubtask()` when Enter is pressed.
 *
 * @param {KeyboardEvent} event - The keyboard event triggered on keydown.
 */
if (subtaskInputEdit) {
  subtaskInputEdit.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      addSubtask();
    }
  });
}


/**
 * Initializes event listeners for the subtask edit input field.
 * Listens for the "Enter" key to add a new subtask without submitting the form.
 * Calls `addSubtask()` when Enter is pressed.
 */
function initSubtaskEditListeners() {
  const subtaskInputEdit = document.getElementById("subtasks_edit");
  if (!subtaskInputEdit) return;
  subtaskInputEdit.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      addSubtask();
    }
  });
}