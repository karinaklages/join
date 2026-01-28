/**
 * Collects all input data for creating a new task and saves it.
 * Reads task title, description, due date, priority, assignees, category, and subtasks from the DOM.
 * Sets the task status (default is "todo").
 * Calls `switchTaskData` to save the new task in Firebase and update the UI.
 * 
 * @async
 * @param {string} [status="todo"] - The initial status of the task.
 * @param {string} HTMLid - The HTML container ID for the task inputs.
 */
async function getAddTaskData(status = "todo", HTMLid) {
  let titleTask = document.getElementById('id_title_add_task_' + HTMLid).value;
  let descriptionTask = document.getElementById('id_description_add_task_' + HTMLid).value;
  let dueDateTask = document.getElementById('id_due_date_add_task_' + HTMLid).value;
  let priorityTask = getPriority(HTMLid);
  let assignedToTask = getAssignee();
  let categoryTask = getTaskCategory(HTMLid);
  let subtasksTask = getAllSubtasks();
  let statusTask = status;
  await switchTaskData(titleTask, descriptionTask, dueDateTask, priorityTask, assignedToTask, categoryTask, subtasksTask, statusTask, HTMLid);
}


/**
 * Retrieves the selected priority from the task form based on the provided HTML ID.
 * 
 * @param {string} HTMLid - The HTML ID suffix used to identify the priority buttons.
 * @returns {Object|null} The priority object if found, otherwise null.
*/
function getPriority(HTMLid) {
  return priorities.find(({ name }) => {
    const priorityElement = document.getElementById('id_' + name + '_btn_' + HTMLid);
    return priorityElement?.classList.contains(name + '_btn_filled');
  }) || null;
}


/**
 * Retrieves the selected category of a task from the DOM.
 * 
 * @param {string} HTMLid - The HTML container ID for the task.
 * @returns {string} The category name of the task.
 */
function getTaskCategory(HTMLid) {
  const categoryElement = document.getElementById('selected_category_' + HTMLid);
  let categoryContent = categoryElement.textContent;
  return categoryContent;
}


/**
 * Collects all subtasks from the task creation/edit list in the DOM.
 * Generates a unique ID for each subtask.
 * Sets all subtasks as incomplete (done: false) by default.
 * Returns an object mapping subtask IDs to their text and status, or an empty string if none exist.
 * 
 * @returns {Object|string} The structured subtasks object or "" if no subtasks exist.
 */
function getAllSubtasks() {
  let subtasks = {};
  document.querySelectorAll('.list_element').forEach(li => {
    let subtaskId = crypto.randomUUID();
    let subtastText = li.querySelector('.subtask_text').textContent.trim();
    subtasks[subtaskId] = {
      text: subtastText,
      done: false
    };
  });
  if (Object.keys(subtasks).length === 0) {
    subtasks = "";
    return subtasks;
  } else {
    return subtasks;
  }
}


/**
 * Retrieves the selected assignees from the task creation dropdown.
 * Collects assignee name, initials, color, and ID for each checked item.
 * Returns an object mapping assignee IDs to their details, or an empty string if none are selected.
 * 
 * @returns {Object|string} The selected assignees object or "" if no assignees are selected.
 */
function getAssignee() {
  let selectedAssignees = {};
  document.querySelectorAll('.dropdown_item_user').forEach(listElement => {
    const validDataChecked = listElement.querySelector('.checkbox_icon');
    if (validDataChecked.dataset.checked === 'true') {
      const name = listElement.querySelector('.user_name_assignee_circle').textContent.trim();
      const initial = listElement.querySelector('.contact_initial_circle').textContent.trim();
      const color = listElement.querySelector('.contact_initial_circle').style.backgroundColor;
      const id = listElement.dataset.assigneeId;
      selectedAssignees[id] = {
        assigneeName: name,
        assigneeInitial: initial,
        assigneeColor: color,
      }
    }
  })
  if (Object.keys(selectedAssignees).length === 0) {
    selectedAssignees = "";
    return selectedAssignees;
  } else {
    return selectedAssignees;
  }
}


/**
 * Retrieves the selected assignees when editing a task.
 * Uses the `selectedAssigneesEdit` array to build the result.
 * Returns an object mapping assignee IDs to their details, or an empty string if none are selected.
 * 
 * @returns {Object|string} The selected assignees object or "" if no assignees are selected.
 */
function getAssigneeInEdit() {
  if (!selectedAssigneesEdit || selectedAssigneesEdit.length === 0) {
    return "";
  }
  let result = {};
  selectedAssigneesEdit.forEach(entry => {
    result[entry.id] = {
      assigneeName: entry.contact.name,
      assigneeInitial: entry.contact.initial,
      assigneeColor: entry.contact.color
    };
  });
  return result;
}


/**
 * Saves or updates a task in Firebase and optionally updates the UI.
 * If `HTMLid` is "task_detail", it updates an existing task using PUT.
 * Otherwise, it creates a new task using POST.
 */
async function switchTaskData(titleTask = "", descriptionTask = "", dueDateTask = "", priorityTask = "", assignedToTask = "", categoryTask = "", subtasksTask = "", statusTask = "", HTMLid, taskID) {
  let taskData = {
    "title": titleTask,
    "description": descriptionTask,
    "dueDate": dueDateTask,
    "priority": priorityTask,
    "assignees": assignedToTask,
    "category": categoryTask,
    "subtasks": subtasksTask,
    "statusTask": statusTask,
  }
  if (HTMLid === 'task_detail') {
    await putToStorage("tasks", taskData, elements = '', HTMLid, taskID);
  } else {
    await postToStorage("tasks", taskData, elements = '', HTMLid);
  }
}


/**
 * Retrieves the contact input elements from the DOM.
 * 
 * @returns {Object} An object containing references to the contact input elements.
 * @property {HTMLInputElement} name - The contact name input field.
 * @property {HTMLInputElement} email - The contact email input field.
 * @property {HTMLInputElement} phonenumber - The contact phone number input field.
 */
function getElementsContacts() {
  return {
    name: document.getElementById('id_contact_name'),
    email: document.getElementById('id_contact_email'),
    phonenumber: document.getElementById('id_contact_phone'),
  };
}


/**
 * Collects contact data from the input fields and saves it.
 * Generates a random color and initials for the contact.
 * Calls `switchContactsData` to update the contact in Firebase and local state.
 */
async function getContactData() {
  const elements = getElementsContacts();
  let contactName = elements.name.value;
  let contactEmail = elements.email.value;
  let contactPhonenumber = elements.phonenumber.value;
  let contactColor = getRandomColor();
  let contactInitals = getContactInitials(contactName);
  await switchContactsData(contactName, contactEmail, contactColor, contactInitals, elements, contactPhonenumber,)
}


/**
 * Saves the changes made to a task in the task detail edit form.
 * Collects updated task fields from the DOM.
 * Prepares subtasks, priority, assignees, and status.
 * Calls `switchTaskData` to update the task in Firebase and local state.
 * 
 * @async
 * @param {string} taskID - The unique ID of the task being edited.
 * @param {number} index - The index of the task in the local task array.
 * @param {string} HTMLid - The HTML container ID for the task (used for UI updates).
 */
async function saveChangesTask(taskID, index, HTMLid) {
  let titleTask = document.getElementById('id_title_task_detail_edit').value;
  let descriptionTask = document.getElementById('id_description_task_detail_edit').value;
  let dueDateTask = document.getElementById('id_due_date_task_detail_edit').value;
  let priorityTask = getPriority(HTMLid);
  let assignedToTask = getAssigneeInEdit();
  let categoryTask = taskList[index].task.category;
  let subtasksTask = getSubtaskEditTask();
  let statusTask = taskList[index].task.statusTask;
  await switchTaskData(titleTask, descriptionTask, dueDateTask, priorityTask, assignedToTask, categoryTask, subtasksTask, statusTask, HTMLid, taskID);
}


/**
 * Collects subtasks from the task edit form.
 * Reads existing subtasks from the DOM.
 * Assigns existing IDs if present, or generates new UUIDs.
 * Returns an object mapping subtask IDs to text and completion status, or an empty string if no subtasks exist.
 * 
 * @returns {Object|string} The structured subtasks object or empty string if no subtasks.
 */
function getSubtaskEditTask() {
  let subtasks = {};
  document.querySelectorAll('.list_element').forEach(li => {
    const subtaskText = li.querySelector('.subtask_text').textContent.trim();
    const datasetSubtaskID = li.dataset.subtaskId;
    const datasetSubtaskStatus = li.dataset.subtaskStatus;
    if (datasetSubtaskID) {
      subtasks[datasetSubtaskID] = {
        text: subtaskText,
        done: datasetSubtaskStatus === "true",
      };
    } else {
      let subtaskId = crypto.randomUUID();
      subtasks[subtaskId] = {
        text: subtaskText,
        done: false
      };
    }
  });
  if (Object.keys(subtasks).length === 0) {
    subtasks = "";
    return subtasks;
  } else {
    return subtasks;
  }
}


/** Extracts initials from a contact's name.
 * @param {string} contactName - The full name of the contact.
 * @returns {string} The initials of the contact in uppercase. */

function getContactInitials(contactName) {
  let contactInitials = contactName.split(" ").map(word => word[0]).join("").toUpperCase();
  return contactInitials;
}


/**
 * Retrieves all task IDs where a specific contact is assigned.
 * 
 * @async
 * @param {string|number} contactId - The ID of the contact/assignee.
 * @returns {Promise<string[]>} An array of task IDs where the contact is assigned.
 */
async function getTasksWithAssignee(contactId) {
  try {
    const res = await fetch(BASE_URL + "tasks.json");
    const tasks = await res.json();
    if (!tasks) return [];
    return Object.entries(tasks)
      .filter(([_, task]) =>
        task.assignees &&
        typeof task.assignees === "object" &&
        task.assignees[contactId]
      )
      .map(([taskId]) => taskId);

  } catch (error) {
    console.error("Fehler beim Updaten:", error);
  }
}


/**
 * Safely updates an assignee's name and initials in all tasks where they are assigned.
 * 
 * @async
 * @param {string|number} contactId - The ID of the assignee to update.
 * @param {string} newName - The new name of the assignee.
 */
async function updateAssigneeInTasksSafe(contactId, newName) {
  const taskIds = await getTasksWithAssignee(contactId);
  const newInitials = getContactInitials(newName);
  for (const taskId of taskIds) {
    try {
      await fetch(
        `${BASE_URL}tasks/${taskId}/assignees/${contactId}.json`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            assigneeName: newName,
            assigneeInitial: newInitials
          })
        });
    } catch (error) {
      console.error("Fehler beim Updaten:", error);
    }
  }
}


/** 
 * Updates or creates contact data in storage.
 * 
 * @param {string} contactName - The name of the contact.
 * @param {string} contactEmail - The email of the contact.
 * @param {string} contactColor - The color associated with the contact.
 * @param {string} contactInitals - The initials of the contact.
 * @param {Object} elements - Optional elements related to the contact.
 * @param {string} contactPhonenumber - The phone number of the contact.
*/
async function switchContactsData(contactName, contactEmail, contactColor, contactInitals, elements = "", contactPhonenumber = "") {
  let contactData = {
    "name": contactName,
    "eMail": contactEmail,
    "phoneNumber": contactPhonenumber,
    "color": contactColor,
    "initial": contactInitals,
  }
  await postToStorage("contacts", contactData, elements)
}


/** 
 * Gathers data from the "User" form and prepares it for storage.
*/
async function getUserData() {
  const elements = getElementsUser();
  let userName = elements.name.value;
  let userEmail = elements.email.value;
  let userPassword = elements.pass.value;
  let userColor = getRandomColor();
  let userInitials = getContactInitials(userName)
  await switchUserData(userName, userEmail, userColor, elements, userPassword, userInitials);
  await switchContactsData(userName, userEmail, userColor, userInitials);
}