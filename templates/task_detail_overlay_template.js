function taskDetailTemplate(taskContent, taskID, taskIndex) {
  return `
    <main class="task_detail_wrapper" data-task_detail_information-id="${taskID}">
      <div class="close_btn_container_task_detail no_scroll">
        <div id="category_label_task_details_${taskID}" class="story_task_btn">${taskContent.category}</div>
        <img class="close_btn" src="./assets/img/x.svg" alt="Close Button" onclick="closeTaskDetailDialog()" role="button" aria-label="Schließen">
      </div>

      <div class="scroll_container">
        <span id="task_detail_title_${taskID}" class="task_detail_title">${taskContent.title}</span>
        <p id="task_detail_description_${taskID}" class="task_detail_description">${taskContent.description}</p>
              
        <table class="recommender_table" aria-label="Page and Recipe Recommender details">
          <tbody>
            <tr>
            <th scope="row" class="task_detail_description table_spacer">Due Date:</th>
            <td class="task_detail_description table_spacer">${taskContent.dueDate}</td>
            </tr>
            <tr>
            <th scope="row" class="task_detail_description table_spacer">Priority:</th>
            <td class="task_detail_description table_spacer_prio icon_gap">${taskContent.priority.name.charAt(0).toUpperCase() + taskContent.priority.name.slice(1)}
              <img src="./assets/img/prio_${taskContent.priority.name}_${taskContent.priority.color}.svg" alt="Prio Urgent">
            </td>
            </tr>
            <tr>
            <th scope="row" class="task_detail_description table_spacer">Assigned to:</th>
            </tr>
          </tbody>
        </table>
        <div id="assignees_task_details_${taskID}" class="assigned_user">
        </div>

        <p class="task_detail_description">Subtasks:</p>
        <div id="subtasks_task_detail_list">
        </div>
      </div>

      <div class="bottom_area">
        <div class="task_detail_btn_area no_scroll">
          <button class="delete_edit_btn" onclick="deleteTask('${taskID}')">
            <img class="icon default" src="./assets/img/delete.svg" alt="Clear Formular">
            <img class="icon hover" src="./assets/img/delete_blue.svg" alt="Clear Formular Hover">
            Delete
          </button>
          <div class="bottom_divider"></div>
          <button class="delete_edit_btn" onclick="openTaskDetailEditDialog('${taskID}' , '${taskIndex}')">
            <img class="icon default" src="./assets/img/edit.svg" alt="Clear Formular">
            <img class="icon hover" src="./assets/img/edit_blue.svg" alt="Clear Formular Hover">
            Edit
          </button>
        </div>
      </div>
    </main>
  `;
}


function AssigneesTaskDetailsTemplate(assignee) {
  return `
    <div class="contact_initial_circle" style="background-color: ${assignee.assigneeColor};">${assignee.assigneeInitial}</div>
    <p>${assignee.assigneeName}</p>
  `;
}


function subtaskTaskDetailsTemplate(subtaskID, subtaskContent, taskID, taskIndex) {
  return ` 
    <img id="checkbox_subtask_task_detail_${subtaskID}" class="checkbox_icon" data-checked="${subtaskContent.done}" src="./assets/img/checkbox_unchecked_contact_form.svg" alt="Checkbox Button">
    <p class="task_detail_description_subtasks">${subtaskContent.text}</p>
  `;
}


function loadAssigneeBubblesToPrefill(element) {
  return `
    <div class="contact_initial_circle assigned_contact" data-assignee-id="${element[1].id}" title="${element[1].name}" style="background-color:${element[1].assigneeColor}">
    ${element[1].assigneeInitial}
    </div>
  `;
}


function taskEditDialogTemplate(taskID, index) {
  return `
    <main class="task_detail_edit_wrapper" data-task_detail_information-id="${taskID}">
      <div class="close_btn_container_task_detail_edit no_scroll_edit">
        <img class="close_btn" src="./assets/img/x.svg" alt="Close Button" onclick="closeTaskDetailEditDialog('edit')" role="button" aria-label="Schließen">
      </div>

      <form class="form_content" id="taskDetailEditForm" novalidate>
        <div class="scroll_container_edit">
          <section class="form_wrapper_edit">
            <div class="form_required_wrapper edit_wrapper">
              <label for="id_title_task_detail_edit" class="label_text_edit">Title<sup>*</sup></label><br>
              <input type="text" class="task_detail_edit_input styled_input_edit validate_edit_required" id="id_title_task_detail_edit" placeholder="Enter a title" oninput="handleRequiredMessage(this); limitInputLength(this, 30)" onfocus="handleRequiredMessage(this)" onblur="handleRequiredMessage(this)"><br>
              <span class="required_message required_message_edit" data-for="id_title_task_detail_edit">This field is required</span><br>
            </div>

            <label for="id_description_task_detail_edit" class="label_text_edit">Description</label><br>
            <textarea class="task_detail_edit_description styled_input_edit_description" id="id_description_task_detail_edit" placeholder="Enter a description" oninput="limitInputLength(this, 90)"></textarea><br>
              
            <div class="form_required_wrapper edit_wrapper">
              <label for="id_due_date_task_detail_edit" class="label_text_edit">Due Date<sup>*</sup></label><br>
              <input type="date" class="task_detail_edit_input styled_input_edit validate_edit_required" id="id_due_date_task_detail_edit" oninput="handleRequiredMessage(this)" onfocus="handleRequiredMessage(this)" onblur="handleRequiredMessage(this)"><br>
              <span class="required_message required_message_edit" data-for="id_due_date_task_detail_edit">This field is required</span><br>
            </div>
          </section>

          <section>
            <label class="label_text_edit">Priority</label><br>
            <div class="priority_options_edit">
              <button type="button" class="urgent_btn_default" id="id_urgent_btn_task_detail" onclick="checkPriority('urgent','task_detail')">
                Urgent
                <img id="id_icon_urgent_task_task_detail" class="icon hover" src="./assets/img/prio_urgent_red.svg" alt="Priority Urgent">
              </button>
              <button type="button" class="medium_btn_filled" id="id_medium_btn_task_detail" onclick="checkPriority('medium','task_detail')">
                Medium
                <img id="id_icon_medium_task_task_detail" class="icon hover" src="./assets/img/prio_medium_white.svg" alt="Priority Medium">
              </button>
              <button type="button" class="low_btn_default" id="id_low_btn_task_detail" onclick="checkPriority('low','task_detail')">
                Low
                <img id="id_icon_low_task_task_detail" class="icon hover" src="./assets/img/prio_low_green.svg" alt="Priority Low">
              </button>
            </div>

            <label class="label_text_edit">Assigned to</label><br>
            <div class="dropdown" data-type="contacts">
              <div class="dropdown_input task_detail_edit_input styled_input_edit mobile_editing" onclick="toggleListTasks('contacts', 'edit')">
                <span class="dropdown_text" id="selected_contacts_edit">Select contacts to assign</span>
                <div class="dropdown_icon"></div>
              </div>
              <ul class="dropdown_list_contacts dropdown_list_contacts_task_detail_edit" id="contacts_list_task_edit" style="display:none;">
              </ul>
            </div>
            <div class="assigned_contacts_row" id="assigned_contacts_row_edit"></div>
            <div class="input_spacer"></div>

            <section class="subtask_wrapper">
              <label for="subtasks" class="label_text_edit">Subtasks</label><br>
              <div class="input_container">
                <input type="text" id="subtasks_edit" class="task_detail_edit_input styled_input_edit add_task_input_edit add_task_input" placeholder="Add new subtask" oninput="limitInputLength(this, 20)">
                <div class="subtask_actions">
                  <button class="subtask_btn" type="button" onclick="cancelSubtask()">
                    <img class="cancel_subtask" src="./assets/img/close.svg" alt="Cancel Subtask">
                  </button>
                  <div class="subtask_divider"></div>
                  <button class="subtask_btn" type="button" onclick="addSubtask()">
                    <img class="submit_subtask" src="./assets/img/check.svg" alt="Submit Subtask">
                  </button>
                </div>
              </div>
              <ul id="subtaskList_edit"></ul>
            </section>
          </section>
        </div>

        <div class="task_detail_edit_btn">
          <button id="editTaskSubmitBtn" type="click" class="ok_btn", '${index}')">Ok<img src="./assets/img/check_white.svg" alt="Edit Button"></button>
        </div>
      </form>
    </main>
  `;
}