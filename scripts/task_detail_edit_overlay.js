/**
 * Opens the "User Story" dialog if it is not already open and loads the template.
 * setTimeout removes focus from any active element.
 * 
 * @function openTaskDetailEditDialog
 * @returns {void} - This function does not return a value.
 */
async function openTaskDetailEditDialog(taskID, index) {
  document.getElementById('taskDetailDialog').close();
  const dialog = document.getElementById('taskDetailEditDialog');
  if (!dialog.open) {
    dialog.showModal();
    dialog.innerHTML = taskEditDialogTemplate(taskID, index);
    loadEventlistenerTaskEditDialog(taskID, index);
    setupDateValidation();
    setupDateClickBehavior();
    initDialogInputs();
    loadEventlistenerForm();
    const subtaskInputEdit = document.getElementById("subtasks_edit");
    subtaskInputEdit?.addEventListener("keydown", e => {
      if (e.key === "Enter") {
        e.preventDefault();
        addSubtask();
      }
    });
    await loadFirebaseData("tasks");
    const currentTaskElement = taskList.find(t => t.id === taskID);
    loadPrefillContent(currentTaskElement.task);
    setTimeout(() => document.activeElement?.blur(), 0);
  }
}


/**
 * Loads all prefill values for the task edit form.
 * 
 * @param {Object} currentTask - The task object containing prefill data.
 */
function loadPrefillContent(currentTask){
  let prefilltitle = loadPrefillTitle(currentTask);
  let prefillDescription = loadPrefillDescription(currentTask);
  let prefillDueDate = loadPrefillDueDate(currentTask);
  let prefillPriority = loadPrefillPriority(currentTask);
  let prefillAssignee = loadPrefillAssignee(currentTask);
  let prefillSubtasks = loadPrefillSubtasks(currentTask);
}


/**
 * Prefills the task title input field.
 * 
 * @param {Object} currentTask - The task object.
 */
function loadPrefillTitle(currentTask){
  let titleHTML = document.getElementById('id_title_task_detail_edit');
  titleHTML.value = currentTask.title;
}


/**
 * Prefills the task description input field.
 * 
 * @param {Object} currentTask - The task object.
 */
function loadPrefillDescription(currentTask){
  let descriptionHTML = document.getElementById('id_description_task_detail_edit');
  descriptionHTML.value = currentTask.description;
}


/**
 * Prefills the task due date input field.
 * 
 * @param {Object} currentTask - The task object.
 */
function loadPrefillDueDate(currentTask){
  let dueDateHTML = document.getElementById('id_due_date_task_detail_edit');
  dueDateHTML.value = currentTask.dueDate;
}


/**
 * Prefills the task priority selection.
 * 
 * @param {Object} currentTask - The task object.
 */
function loadPrefillPriority(currentTask){
  let priorityName = currentTask.priority.name;
  checkPriority(priorityName, "task_detail");
}


/**
 * Prefills the assignees section of the task edit form.
 * @param {Object} currentTask - The task object.
 */
function loadPrefillAssignee(currentTask) {
  const assigneeContainer = document.getElementById("assigned_contacts_row_edit");
  assigneeContainer.innerHTML = "";
  selectedAssigneesEdit = []; 
  if (!currentTask.assignees) return; 
  let prefillAssignees = currentTask.assignees;
  Object.entries(prefillAssignees).forEach(([id, contact]) => {
      selectedAssigneesEdit.push({
      id: id,
      contact: {
        name: contact.assigneeName,
        color: contact.assigneeColor,     
        initial: contact.assigneeInitial 
      }
    });
  });
  renderAssignedContacts('edit');
}


/**
 * Prefills the subtask list of the task edit form.
 * @param {Object} currentTask - The task object.
 */
function loadPrefillSubtasks(currentTask){
  let subtaskElements = currentTask.subtasks;
  let substaskHTML = document.getElementById("subtaskList_edit");
  substaskHTML.innerHTML ="";
  Object.entries(subtaskElements).forEach(element => {
    let contentSubtask = element[1].text;
    const li = document.createElement("li");
    li.className = "list_element";
    li.innerHTML = listSubtaskTemplate(contentSubtask);
    li.dataset.subtaskId = element[0];
    li.dataset.subtaskStatus = element[1].done;
    substaskHTML.appendChild(li);
  })
}


/**
 * Closes the "User Story" dialog.
 * Removes its content and resets all contact input fields.
 * 
 * @function closeTaskDetailEditDialog
 * @returns {void} - This function does not return a value.
 */
function closeTaskDetailEditDialog(HTMLid) {
  const dialog = document.getElementById('taskDetailEditDialog');
  if (!dialog) return;
  dialog.close();
  clearInputs(HTMLid);
}


/**
 * Initializes dialog inputs to be read-only by default and makes them editable on focus.
 */
function initDialogInputs() {
  const dialog = document.getElementById('taskDetailEditDialog');
  const inputs = dialog.querySelectorAll('input, textarea');
  inputs.forEach(input => {
    input.readOnly = true;
    input.addEventListener('focus', function() {
      this.readOnly = false;
    });
  });
}


/**
 * Checks whether all required task fields are filled.
 * Validates title, and due date selection.
 *
 * @returns {boolean} True if all required fields are filled, otherwise false.
 */
function areRequiredEditFieldsFilled() {
  const title = document.getElementById('id_title_task_detail_edit').value.trim();
  const dueDate = document.getElementById('id_due_date_task_detail_edit').value.trim();
  const isTitleFilled = title.length > 0;
  const isDueDateFilled = dueDate.length > 0;
  return isTitleFilled && isDueDateFilled;
}


/**
 * Highlights missing required fields in the task form.
 * Adds error styles and displays validation messages for empty inputs and an unselected category.
 */
function highlightRequiredEditFields() {
  const titleEdit = document.getElementById('id_title_task_detail_edit');
  const dueDateEdit = document.getElementById('id_due_date_task_detail_edit');
  titleEdit.value.trim() === ""
    ? (titleEdit.classList.add('error'),
      document.querySelector('.required_message[data-for="id_title_task_detail_edit"]').style.display = "block")
    : (titleEdit.classList.remove('error'),
      document.querySelector('.required_message[data-for="id_title_task_detail_edit"]').style.display = "none");
  dueDateEdit.value.trim() === ""
    ? (dueDateEdit.classList.add('error'),
      document.querySelector('.required_message[data-for="id_due_date_task_detail_edit"]').style.display = "block")
    : (dueDateEdit.classList.remove('error'),
      document.querySelector('.required_message[data-for="id_due_date_task_detail_edit"]').style.display = "none");
  categorySpan.textContent.trim() === "Select task category"
    ? (categorySpan.style.color = "#FF3D00")
    : (categorySpan.style.color = "");
}


/**
 * Initializes form event listeners for task editing.
 * Enables or disables the submit button based on required field validation.
 * Prevents default form submission. Saves the task and closes the edit dialog when validation passes.
 */
function  loadEventlistenerForm(){
  const form = document.querySelector('.form_wrapper_edit');
  const submitBtn = document.getElementById('editTaskSubmitBtn');
  form.addEventListener('input', () => {
  submitBtn.disabled = !areRequiredEditFieldsFilled(form);
  });
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    highlightRequiredEditFields(form);
    if (!areRequiredEditFieldsFilled(form)) {
      return;
    }
    await getAddTaskData();
    closeTaskDetailEditDialog();
  });
}


/**
 * Initializes the event listener for the task edit dialog submit button.
 * Replaces the submit button to remove old event listeners.
 * Saves the edited task and updates the board. Closes the task edit dialog after saving.
 * 
 * @param {string} taskID - The ID of the task being edited.
 * @param {number} index - The index of the task in the task list.
 */
function loadEventlistenerTaskEditDialog(taskID, index) {
  const okBtn = document.getElementById('editTaskSubmitBtn');
  const newOkBtn = okBtn.cloneNode(true);
  okBtn.parentNode.replaceChild(newOkBtn, okBtn);
  newOkBtn.addEventListener('click', async function(event) {
    event.preventDefault(); 
    await saveChangesTask(taskID, index, 'task_detail');
    await loadContentBoard();
    closeTaskDetailEditDialog('task_detail_edit');
  });
}