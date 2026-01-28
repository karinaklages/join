function loadContactListItem(c) {
    return `        
        <li>
            <button class="contact_person" onclick="setContactActive('${c.id}', this)" id="${c.id}">
                <span class="initals" style="background-color: ${c.color};">${getContactInitials(c.name)}</span>
                <div class="small_info">
                    <h3 id="name-${c.id}">${c.name}</h3>
                    <span>${c.eMail}</span>
                </div>
            </button>
        </li>
    `;
}


function addContactButtonTemplate() {
    return `
        <div class="button_container">
            <button class="contact_btn" id="addNewContactBtn" onclick="openAddContactDialog()">
                <span>Add new Contact</span>
                <img src="./assets/img/person_add_white.svg" alt="add Person" />
            </button>
        </div>
    `;
}


function contactHeadlineTemplate() {
    return `
        <div class="contact_headline">
            <div class="headline">
                <h3>Contacts</h3>
                <button id="backBtn" onclick="checkForBackBtn()"></button>
            </div>
            <div class="headline_seperator"></div>
            <span>Better with a team</span>
        </div>
    `;
}


function contactInitialsTemplate(c) {
    return `
        <div class="contact_big" id="contact_big">
            <div class="initials_big" style="background-color: ${c.color};">${getContactInitials(c.name)}</div>
            <div class="name_big">
                <span id="contactDetailName">${c.name}</span>
                <div class="changebtns" id="changeContactBtns">
                    <div id="changebtnsPopover">
                        <button id="editContactBtn" class="edit_btn" onclick="openEditContactDialog('${c.id}', this)">
                            <img src="./assets/img/edit.svg" alt="Edit" />Edit
                        </button>
                        <button id="deleteContactBtn" class="delete_btn" onclick="deleteContact('${c.id}')">
                            <img src="./assets/img/delete.svg" alt="Delete" />Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}


function contactInfoTemplate(c) {
    return `       
        <div class="contact_big_information" id="contact_big_information">
            <span id="cinfo">Contact Information</span>
            <div class="contact_deep_info">
                <div class="contact_mail">
                    <span>E-Mail</span>
                    <a id="contact_detail_mail" href="mailto:${c.eMail}">${c.eMail}</a>
                </div>
                <div class="contact_phone">
                    <span>Phone</span>
                    <a id="contact_detail_phone" href="tel:${c.phoneNumber}">${c.phoneNumber}</a>
                </div>
            </div>
        </div>
    `;
}


function contactSeperatorTemplate(currentLetter) {
    return `
        <li>
            <p class="beginning_letter">${currentLetter}</p>
            <div class="contact_seperator"></div>
        </li>
    `;
}