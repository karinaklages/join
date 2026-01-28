function listSubtaskTemplate(value) {
    return `
        <div class="list_row">
            <span class="subtask_text new_subtask">${value}</span>
            <div class="list_icon_element">
                <button class="subtask_btn" type="button" onclick="editSubtask(this)">
                    <img class="edit_subtask" src="./assets/img/edit.svg" alt="Edit Subtask">
                </button>
                <button class="subtask_btn" type="button" onclick="this.closest('li').remove()">
                    <img class="delete_subtask" src="./assets/img/delete.svg" alt="Delete Subtask">
                </button>
            </div>
        </div>

        <div class="edit_container" style="display:none;">
            <input type="text" class="subtask_edit_input styled_input" value="${value}" oninput="limitInputLength(this, 25)">
            <hr class="subtask_edit_hr">
            <div class="subtask_edit_area">
                <button class="subtask_edit_btn" type="button" onclick="cancelEdit(this)">
                    <img class="cancel_subtask_edit" src="./assets/img/delete.svg" alt="Cancel Edit">
                </button>
                <button class="subtask_edit_btn" type="button" onclick="saveEdit(this)">
                    <img class="submit_subtask" src="./assets/img/check.svg" alt="Save Edit">
                </button>
            </div>
        </div>
    `;
}


function listAssigneeTemplate(contactsList, index, imgPath, checkState, HTMLid) {
    return `
        <div class="dropdown_item_user" data-assignee-id="${contactsList[index].id}">
            <div class="user_info user_info_taks_detail_edit">
                <div class="contact_initial_circle" style="background-color: ${contactsList[index].contact.color};">
                    ${contactsList[index].contact.initial} 
                </div>
                <p class="user_name_assignee_circle user_name_assignee_circle_taks_detail_edit">${contactsList[index].contact.name}</p>
            </div>
            <img class="checkbox_icon checkbox_icon_taks_detail_edit" data-checked="${checkState}" src="${imgPath}" alt="Checkbox Button">
        </div>
    `;
}