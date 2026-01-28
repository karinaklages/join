const priorities = [
  { name: "urgent", color: "red" },
  { name: "medium", color: "yellow" },
  { name: "low", color: "green" },
];


/**
 * Initializes the "Add Task" view.
 */
function initAddTask() {
  init(),
  loadEventlistener('default')
}


/**
 * Opens the "Add Task" dialog if it is not already open and loads the template.
 * Checks the window width to determine whether to redirect to a mobile page.
 * setTimeout removes focus from any active element.
 *
 * @function openAddTaskDialog
 * @returns {void} - This function does not return a value.
 */
function openAddTaskDialog(status) {
  if (window.innerWidth < 700) {
    window.location.href = "add_task.html";
    return;
  }
  const dialog = document.getElementById("addTaskDialog");
  const btn = document.getElementById("id_btn_create_task_overlay");
  btn.dataset.taskParam = status;
  if (!dialog.open) {
    dialog.showModal();
    checkPriority("medium", dialog);
    setTimeout(() => {
      document.activeElement?.blur();
    }, 0);
  }
}


/**
 * Closes the "Add Task" dialog.
 * Removes its content and resets all contact input fields.
 *
 * @function closeAddTaskDialog
 * @returns {void} - This function does not return a value.
 */
function closeAddTaskDialog(HTMLid) {
  const dialog = document.getElementById("addTaskDialog");
  if (!dialog) return;
  dialog.close();
  clearInputs(HTMLid);
}


/**
 * Resets all task input fields to their default state.
 * Clears input values, removes error styles, hides required messages, and resets the selected category.
 */
function resetInputFields(HTMLid) {
  const inputIds = ["title", "description", "due_date", "subtasks"];
  inputIds.forEach(idElement => {
    const element = document.getElementById("id_" + idElement + "_add_task_" + HTMLid);
    if (element) {
      if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
        element.value = "";
        element.classList.remove("error");
      } else {
        element.innerHTML = "";
      }
      const message = document.querySelector(".required_message[data-for=id_" + idElement + "_add_task]");
      if (message) message.style.display = "none";
    }
  });
  const categorySpan = document.getElementById("selected_category_" + HTMLid);
  if (categorySpan) {
    categorySpan.innerHTML = "Select task category";
    categorySpan.style.color = "";
  }
}


/**
 * Clears all selected assignees in the given dialog.
 * Resets the assignee array, unchecks all checkboxes, and removes assigned contacts from the UI.
 *
 * @param {string} dialogId - The dialog identifier
 */
function clearSelectedAssigneesByDialog(HTMLid) {
  if (HTMLid === "default") {
    selectedAssignees = [];
  } else {
    selectedAssigneesEdit = [];
  }
  document
    .querySelectorAll(`#contacts_list_task_${HTMLid} .checkbox_icon`)
    .forEach(checkbox => {
      checkbox.dataset.checked = "false";
      checkbox.src = "./assets/img/checkbox_unchecked.svg";
    });
  const assignedRow = document.getElementById(
    "assigned_contacts_row_" + HTMLid
  );
  if (assignedRow) assignedRow.innerHTML = "";
}


/**
 * Clears and resets the entire "Add Task" form.
 * Resets input fields, clears assigned contacts and subtasks, closes dropdowns, resets priority, and cancels subtask editing.
 */
function clearInputs(HTMLid) {
  clearSelectedAssigneesByDialog(HTMLid);
  resetInputFields(HTMLid);
  const selectedContactsElement = document.getElementById("selected_contacts_" + HTMLid);
  if (selectedContactsElement) {
    selectedContactsElement.innerHTML = "Select contacts to assign";
  }
  const assignedContactsRow = document.getElementById("assigned_contacts_row_" + HTMLid);
  if (assignedContactsRow) {
    assignedContactsRow.innerHTML = "";
  }
  closeDropdownLists();
  if (typeof subtaskList !== 'undefined' && subtaskList) subtaskList.innerHTML = "";
  if (typeof subtaskListEdit !== 'undefined' && subtaskListEdit) subtaskListEdit.innerHTML = "";
  checkPriority("medium", HTMLid);
  cancelSubtask();
}


/**
 * Updates the UI to reflect the currently selected priority.
 * Iterates over all priorities and activates the matching one.
 *
 * @param {string} status - The currently selected priority name.
 */
function checkPriority(status, suffix, prefix = 'id',) {
  priorities.forEach(({ name, color }) => {
    updatePriorityButton(name, name === status, color, prefix, suffix);
  });
}


/**
 * Updates the appearance of a priority button and its icon.
 * Toggles active/inactive styles and switches the icon based on state.
 *
 * @param {string} priority - The priority name (e.g. "low", "medium", "urgent").
 * @param {boolean} isActive - Whether the priority is currently active.
 * @param {string} color - The default color used for the inactive icon.
 */
function updatePriorityButton(priority, isActive, color, prefix, suffix) {
  const btn = document.getElementById(`${prefix}_${priority}_btn_${suffix}`);
  const icon = document.getElementById(`${prefix}_icon_${priority}_task_${suffix}`);
  if (!btn || !icon) return;
  btn.classList.toggle(`${priority}_btn_filled`, isActive);
  btn.classList.toggle(`${priority}_btn_default`, !isActive);
  icon.src = isActive
    ? `./assets/img/prio_${priority}_white.svg`
    : `./assets/img/prio_${priority}_${color}.svg`;
}


/**
 * Calls checkPriority("medium") and displays it as "default" button after the DOM is loaded.
 *
 * @event DOMContentLoaded
 * @returns {void} - This event handler does not return a value.
 */
document.addEventListener("DOMContentLoaded", () => {
  checkPriority('medium', 'task_detail');
});


/**
 * Shows or hides a required field message and toggles an error class based on whether the input is empty and focused.
 *
 * @param {HTMLInputElement} input - The input field to validate.
 */
function handleRequiredMessage(input) {
  const message = document.querySelector(`.required_message[data-for="${input.id}"]`);
  if (!message) return;
  if (input === document.activeElement && input.value.trim() === "") {
    message.style.display = "block";
    if (input.classList.contains("validate_required")) {
      input.classList.add("error");
    }
  } else {
    message.style.display = "none";
    input.classList.remove("error");
  }
}


/**
 * Toggles the visibility of a task-related list element.
 * Shows or hides the corresponding list and triggers additional checks when the list is opened.
 *
 * @function toggleListTasks
 * @param {string} element - The base name of the list to toggle.
 * @returns {void} - This function does not return a value.
 */
function toggleListTasks(element, HTMLid) {
  let list = document.getElementById(element + "_list_task_" + HTMLid);
  if (list.style.display === "none") {
    list.style.display = "block";
    checkContactList(element, HTMLid);
    syncDropdownCheckboxes(HTMLid);
  } else {
    list.style.display = "none";
  }
}


/**
 * Collapses the contacts and category dropdown lists if it is currently expanded.
 *
 * @function closeDropdownLists
 * @returns {void} - This function does not return a value.
 */
function closeDropdownLists() {
  const contactsList = document.getElementById("contacts_list_task");
  if (contactsList) {
    contactsList.style.display = "none";
  }
  const categoryList = document.getElementById("category_list_task");
  if (categoryList) {
    categoryList.style.display = "none";
  }
}


/**
 * Selects category element via onclick. Hides the category list after selection.
 *
 * @param {HTMLElement} element - The clicked category element.
 * @returns {void} - This function does not return a value.
 */
function selectCategory(element, HTMLid) {
  const categorySpan = document.getElementById("selected_category_" + HTMLid);
  categorySpan.innerHTML = element.innerHTML;
  document.getElementById("category_list_task_" + HTMLid).style.display = "none";
  categorySpan.style.color = "";
}


/**
 * Handles the click event for the "Create Task" button.
 * Prevents the default form submission behavior and triggers the task creation process by collecting and processing task data.
 *
 * @event click
 * @listens HTMLButtonElement#click
 * @returns {Promise<void>} - A promise that resolves when the task data has been processed.
 */
function loadEventlistener(HTMLid) {
  const createBtn = document.getElementById("id_btn_create_task_" + HTMLid);
  if (createBtn) {
    createBtn.addEventListener("click", async function (event) {
      event.preventDefault();
      const statusTasks = this.dataset.taskParam;
      if (areRequiredFieldsFilled(HTMLid)) {
        await getAddTaskData(statusTasks, HTMLid);
        closeAddTaskDialog('overlay');
        showToast();
        if (HTMLid === "overlay") {
          loadContentBoard();
        }
      } else {
        highlightRequiredFields(HTMLid);
      }
    });
  }
}


/**
 * Checks whether all required task fields are filled.
 * Validates title, due date, and category selection.
 *
 * @returns {boolean} True if all required fields are filled, otherwise false.
 */
function areRequiredFieldsFilled(HTMLid) {
  const title = document.getElementById('id_title_add_task_' + HTMLid).value.trim();
  const dueDateInput = document.getElementById('id_due_date_add_task_' + HTMLid);
  const category = document.getElementById('selected_category_' + HTMLid).textContent.trim();
  const isTitleFilled = title.length > 0;
  const isDueDateFilled = dueDateInput.value.length > 0 && dueDateInput.value >= "2026-01-01";
  const isCategoryFilled = category !== 'Select task category';
  return isTitleFilled && isDueDateFilled && isCategoryFilled;
}


/**
 * Highlights missing required fields in the task form.
 * Adds error styles and displays validation messages for empty inputs and an unselected category.
 */
function highlightRequiredFields(HTMLid) {
  const titleInput = document.getElementById('id_title_add_task_' + HTMLid);
  const dateInput = document.getElementById('id_due_date_add_task_' + HTMLid);
  const category = document.getElementById('selected_category_' + HTMLid);
  if (!titleInput || !dateInput || !category) {
    return;
  }
  const titleMsg = document.querySelector(`.required_message[data-for="id_title_add_task_${HTMLid}"]`);
  const dateMsg = document.querySelector(`.required_message[data-for="id_due_date_add_task_${HTMLid}"]`);
  const isTitleEmpty = titleInput.value.trim() === "";
  titleInput.classList.toggle('error', isTitleEmpty);
  if (titleMsg) {
    titleMsg.style.display = isTitleEmpty ? "block" : "none";
  }
  const isDateError = !dateInput.value || dateInput.value < "2026-01-01";
  dateInput.classList.toggle('error', isDateError);
  if (dateMsg) {
    dateMsg.style.display = isDateError ? "block" : "none";
    dateMsg.innerText = dateInput.value ? "Date must be 2026 or later" : "This field is required";
  }
  category.style.color = category.innerText === "Select task category" ? "#FF3D00" : "";
}