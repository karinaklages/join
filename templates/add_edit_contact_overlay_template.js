function addContactTemplate() {
    return `
        <main class="contact_overlay_wrapper">
            <section class="contact_left_container">
                <img class="logo_overlay" src="./assets/img/logo_version2.svg" alt="Join Logo">
                <span class="headline_overlay">Add Contact</span>
                <span class="subhead_overlay">Tasks are better with a team!</span>
                <hr class="hr_overlay">
            </section>
            <form id="addContactForm" novalidate>
                <section class="contact_right_container">
                    <div class="close_btn_container_contact_overlay">
                        <img class="close_btn" src="./assets/img/x.svg" alt="Close Button" onclick="closeAddContactDialog()" role="button" aria-label="Close Dialog">
                    </div>
                    <div class="right_container_wrapper">
                        <div class="avatar_wrapper">
                            <img class="contact_user_icon" src="./assets/img/person_grey_circle.svg" alt="User Icon">
                        </div>
                        <div>
                            <div class="input_fields_container">
                                <input type="text" id="id_contact_name" class="contact_input styled_input" placeholder="Name" required oninput="limitInputLength(this, 20)"><br>
                                <span class="error_text" id="error_name">Name must be at least 2 characters</span>
                                <input type="email" id="id_contact_email" class="contact_input styled_input" placeholder="Email" required oninput="limitInputLength(this, 20)"><br>
                                <span class="error_text" id="error_email">Not a valid E-Mail</span>
                                <input type="tel" id="id_contact_phone" class="contact_input styled_input" placeholder="Phone" required oninput="limitInputLength(this, 17)"><br>
                                <span class="error_text" id="error_phone">Not a valid phone number</span>
                            </div>
                            <div class="contact_btn_area">
                                <button type="button" class="outline_btn show_btn" onclick="closeAddContactDialog()">Cancel
                                    <img class="icon default" src="./assets/img/close.svg" alt="Clear Formular">
                                    <img class="icon hover" src="./assets/img/close_blue.svg" alt="Clear Formular Hover">
                                </button>
                                <button type="button" id="createContactBtn" class="filled_btn" onclick="createContact()">Create Contact<img src="./assets/img/check_white.svg" alt="Create Contact"></button>
                            </div>
                        </div>
                    </div>    
                </section>
            </form>
        </main>
    `;
}


function editContactTemplate(c) {
    return `
        <main class="contact_overlay_wrapper">
            <section class="contact_left_container">
                <img class="logo_overlay" src="./assets/img/logo_version2.svg" alt="Join Logo">
                <span class="headline_overlay">Edit Contact</span>
                <hr class="hr_overlay">
            </section>
            <form id="editContactForm" novalidate>
                <section class="contact_right_container">
                    <div class="close_btn_container_contact_overlay">
                        <img class="close_btn" src="./assets/img/x.svg" alt="Close Button" onclick="closeEditContactDialog()" role="button" aria-label="Close Dialog">
                    </div>
                    <div class="right_container_wrapper">
                        <div class="avatar_wrapper">
                            <div class="initals_big" style="background-color:${c.color};">${getContactInitials(c.name)}</div>
                        </div>
                        <div>
                            <div class="input_fields_container">
                                <input type="text" id="input-name" class="user_input styled_input" placeholder="Name" value="${c.name}" required oninput="limitInputLength(this, 20)"><br>
                                <span class="error_text" id="error_name">Name must be at least 2 characters</span>
                                <input type="email" id="input-email" class="user_input styled_input" placeholder="Email" value="${c.eMail}" required oninput="limitInputLength(this, 20)"><br>
                                <span class="error_text" id="error_email">Not a valid E-Mail</span>
                                <input type="tel" id="input-phone" class="user_input styled_input" placeholder="Phone Number" value="${c.phoneNumber}" required oninput="limitInputLength(this, 17)"><br>
                                <span class="error_text" id="error_phone">Not a valid phone number</span>
                            </div>
                            <div class="contact_btn_area">
                                <button type="button" class="outline_btn" onclick="deleteContact('${c.id}')">Delete
                                    <img class="icon default" src="./assets/img/close.svg" alt="Clear Formular">
                                    <img class="icon hover" src="./assets/img/close_blue.svg" alt="Clear Formular Hover">
                                </button>
                                <button type="button" id="saveContactBtn" class="filled_btn" onclick='updateContact("${c.id}")'>Save
                                    <img src="./assets/img/check_white.svg" alt="Save Contact">
                                </button>
                            </div>
                        </div>
                    </div>   
                </section>
            </form> 
        </main>
    `;
}