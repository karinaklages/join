window.addEventListener("resize", resizeHandler)

const contactsArray = [];
const usersArray = [];


/**
 * Initializes the "Contacts" view.
 */
function initContacts() {
    init(),
        renderContactList()
}


/**
 * Handles the activation and display of a selected contact in the contact list UI.
 * Toggles the "active_contact" class, updates the contact info panel, and manages responsive behavior.
 *
 * @param {number|string} id - The unique identifier of the contact to activate.
 * @param {HTMLElement} element - The DOM element representing the contact that was clicked.
 */
function setContactActive(id, element) {
    const isActive = element.classList.contains("active_contact");
    const cInfo = document.getElementById('contact_info')
    const contacts = document.getElementsByClassName("contact_person");
    const selectedContact = contactsArray.find(entry => entry.id == id);
    for (let i = 0; i < contacts.length; i++) {
        contacts[i].classList.remove("active_contact");
    }
    if (isActive) {
        cInfo.innerHTML = contactHeadlineTemplate();
        minimizeContactListon950px(element)
        return;
    }
    element.classList.add("active_contact");
    minimizeContactListon950px()
    renderContactInfo(selectedContact)
    renderMobileClickedContact()
    slideContactInfo()
}


/**
 * Minimizes the contact list UI when the viewport width is 950px or less and an active contact is selected.
 * Removes the minimized state if the viewport is larger than 950px or if no contact is active.
 */
function minimizeContactListon950px() {
    const contactList = document.getElementById('contact_list_container')
    const hasActiveContact = !!document.querySelector('.active_contact')
    if (getViewportSize() <= 950 && hasActiveContact) {
        contactList.classList.add('minimized_contact_list')
    } else if (getViewportSize() > 950 || !hasActiveContact) {
        contactList.classList.remove('minimized_contact_list')
    }
}


/**
 * Renders the detailed information of a selected contact into the contact info section of the page.
 *
 * @param {Object} selectedContact - The contact object containing the information to display.
 */
function renderContactInfo(selectedContact) {
    const cInfo = document.getElementById('contact_info')
    cInfo.innerHTML = ""
    cInfo.innerHTML = contactHeadlineTemplate() + contactInitialsTemplate(selectedContact) + contactInfoTemplate(selectedContact)
}


/**
 * Renders the contact information for a local contact by their ID.
 * Finds the contact in the contactsArray, renders their information,
 * and triggers the contact info slide animation.
 *
 * @param {number|string} id - The unique identifier of the contact to render.
 */
function renderLocalContactInfo(id) {
    const selectedContact = contactsArray.find(entry => entry.id == id);
    renderContactInfo(selectedContact)
    slideContactInfo()
}


/**
 * Toggles the 'slideactive' class on the contact detail elements to animate their visibility.
 * Uses requestAnimationFrame to ensure the DOM updates are rendered smoothly.
 */
function slideContactInfo() {
    requestAnimationFrame(() => {
        const bigContact = document.getElementById('contact_big')
        const bigContactInfo = document.getElementById('contact_big_information')
        bigContact.classList.toggle('slideactive')
        bigContactInfo.classList.toggle('slideactive')
    })
}


/**
 * Adjusts the display of the contact list and contact info sections based on the viewport size.
 * - For viewports <= 800px, shows the contact list, hides the contact info, and resets active contact states.
 * - For viewports > 800px, displays both the contact list and contact info.
 */
function checkForBackBtn() {
    const contactList = document.getElementById('contact_list_container')
    const contactInfo = document.getElementById('contact_info')
    const contacts = document.getElementsByClassName("contact_person")
    if (getViewportSize() <= 800) {
        contactList.classList.remove('minimized_contact_list')
        contactList.style.display = "flex"
        contactInfo.style.display = "none"
        for (let i = 0; i < contacts.length; i++) {
            contacts[i].classList.remove("active_contact");
            const cInfo = document.getElementById('contact_info')
            cInfo.innerHTML = contactHeadlineTemplate()
        }
    } else if (getViewportSize() > 800) {
        contactList.style.display = "flex"
        contactInfo.style.display = "flex"
    }
}


/**
 * Initializes the event listeners for the change contact buttons popover.
 * Toggles the 'active_popover' class on the button.
 */
function changeBtnsPopover() {
    let changeContactBtns = document.getElementById('changeContactBtns')
    changeContactBtns.addEventListener('click', () => {
        changeContactBtns.classList.toggle('active_popover');
    })
    document.addEventListener('mouseup', function (e) {
        if (!changeContactBtns.contains(e.target)) {
            changeContactBtns.classList.remove('active_popover');
        }
    })
}


/**
 * Returns the current width of the viewport in pixels.
 * 
 * @returns {number} The width of the viewport.
 */
function getViewportSize() {
    return window.innerWidth
}


/**
 * Renders the mobile view when a contact is clicked.
 * Hides the contact list on small viewports (≤ 800px) and displays the contact info panel.
 * Updates the popover button states accordingly.
 */
function renderMobileClickedContact() {
    const contactList = document.getElementById('contact_list_container')
    const contactInfo = document.getElementById('contact_info')
    const button = document.getElementById('addNewContactBtn')
    contactList.style.display = getViewportSize() <= 800 ? "none" : "flex"
    contactInfo.style.display = "flex"
    changeBtnsPopover()
}


/**
 * Handles responsive layout adjustments for the contact list and contact info panels.
 * 
 * @function resizeHandler
 * @returns {void}
 */
function resizeHandler() {
    const contactList = document.getElementById('contact_list_container')
    const contactInfo = document.getElementById('contact_info')
    const hasActiveContact = !!document.querySelector(".active_contact")
    contactList.style.display = (hasActiveContact && (getViewportSize() <= 800)) ? "none" : "flex"
    contactInfo.style.display = (!hasActiveContact && (getViewportSize() <= 800)) ? "none" : "flex"
    minimizeContactListon950px()
}


/**
 * Sorts an array of contact objects by their first name in alphabetical order.
 * 
 * @param {Array<{name: string}>} element - An array-like object containing contact objects with a name property
 * @returns {Array<{name: string}>} A new array of contacts sorted by first name (case-insensitive, A-Z)
 */
function sortContactsByFirstName(element) {
    return [...element].sort((a, b) => {
        const firstNameA = a.name.split(" ")[0].toUpperCase();
        const firstNameB = b.name.split(" ")[0].toUpperCase();
        return firstNameA.localeCompare(firstNameB);
    });
}


/**
 * Gets the contact list items
 * @returns contact list items
 */
async function getContactListData() {
    return await loadFirebaseData('contacts');
}


/**
 * Renders the local contact list in the DOM, organized alphabetically by first name.
 * Groups contacts by their first letter and adds separator headers for each letter group.
 */
function renderLocalContactList() {
    const container = document.getElementById('contact_list');
    container.innerHTML = "";
    let currentLetter = "";
    for (let i = 0; i < contactsArray.length; i++) {
        const firstName = contactsArray[i].name.split(" ")[0];
        const firstLetter = firstName[0].toUpperCase();
        if (firstLetter !== currentLetter) {
            currentLetter = firstLetter;
            container.innerHTML += contactSeperatorTemplate(currentLetter);
        }
        container.innerHTML += loadContactListItem(contactsArray[i]);
    }
}


/**
 * Updates the Firebase users table of
 * @param {string} id user-id
 * @param {object} userData 
 */
async function updateUserFromContact(id, userData) {
    singleContact = fetch(BASE_URL + "user/" + id + ".json", {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });
    singleContact.then(response => {
        if (!response.ok) {
            throw new Error(`HTTP Fehler! Status: ${response.status}`);
        }
        return response.json();
    })
}


/**
 * Checks if a contact exists in the user list and updates the user data if found.
 * @returns {Promise<void>} Resolves when the user data has been updated, or immediately if contact not found
 */
async function checkContactInUser(oldName, oldMail, newName, newMail) {
    await getUsersData()
    let userInContact = userList.find(entry => entry.user.eMail == oldMail || entry.user.name == oldName)
    if (!userInContact) {
        return
    }
    let userId = userInContact.id;
    const userData = {
        eMail: contactsArray.find(entry => entry.eMail === newMail).eMail,
        name: contactsArray.find(entry => entry.name === newName).name,
        initial: getContactInitials(contactsArray.find(entry => entry.name === newName).name)
    }
    updateLocalStorage(newName, newMail)
    await updateUserFromContact(userId, userData)
}


/**
 * Updates the active user information in localStorage and refreshes the navbar.
 */
function updateLocalStorage(newName, newMail) {
    let updatedData = { "name": newName, "email": newMail, "initials": getContactInitials(newName) }
    localStorage.setItem("activeUser", JSON.stringify(updatedData));
    loadNavbar()
}


/**
 * Checks if the active user from localStorage exists in the contacts array and marks it.
 * 
 * Retrieves the active user from localStorage, searches for a matching contact by email,
 * and verifies that the user's name matches the contact's name. If a match is found,
 * appends "(Ich)" to the contact's list item and applies a CSS class for styling.
 * 
 * @returns {boolean|undefined} Appends " (Ich)" to the contact's list item and applies a CSS class for styling if the contact is found and name matches.
 */
function checkActiveUser() {
    let user = JSON.parse(localStorage.getItem('activeUser'));
    let contact = contactsArray.find(entry => entry.eMail == user.email)
    if (!contact) {
        return false
    }
    if (user.name != contact.name) {
        return false
    } else if (contact != null && user.name == contact.name) {
        let contactListItem = document.getElementById("name-" + contact.id)
        contactListItem.innerText += " (Ich)"
        contactListItem.classList.add('myActiveUser')
    }
}


/**
 * Renders the contact list organized alphabetically by first letter of first name.
 * 
 * Clears the current contact list, fetches fresh contact data, and populates the DOM
 * with contacts grouped under letter separators. Exits early if no active user is logged in.
 */
async function renderContactList() {
    contactsArray.length = 0;
    await getContactListData();
    const container = document.getElementById('contact_list');
    container.innerHTML = "";
    let currentLetter = "";
    pushToLocalContacts();
    for (let i = 0; i < contactsArray.length; i++) {
        const firstName = contactsArray[i].name.split(" ")[0];
        const firstLetter = firstName[0].toUpperCase();
        if (firstLetter !== currentLetter) {
            currentLetter = firstLetter;
            container.innerHTML += contactSeperatorTemplate(currentLetter);
        }
        container.innerHTML += loadContactListItem(contactsArray[i]);
    }
    if (checkActiveUser() != false) {
        return
    }
}


/**
 * Populates the global `contactsArray` with contact objects derived from `contactsList`.
 * After populating, the contacts are sorted alphabetically by first name.
 */
function pushToLocalContacts() {
    contactsList.forEach(element => {
        let obj = {
            id: element.id,
            name: element.contact.name,
            eMail: element.contact.eMail,
            phoneNumber: element.contact.phoneNumber,
            color: element.contact.color
        }
        contactsArray.push(obj);
    })
    contactsArray.sort((a, b) => a.name.localeCompare(b.name));
}


/**
 * Deletes a contact by its identifier from the local contacts array and updates the UI.
 * @param {string|number} ident - The unique identifier of the contact to delete.
 */
async function deleteContact(ident) {
    const idContactStorage = contactsArray.find(entry => entry.id == ident);
    const contactsListStorage = contactsList.find(entry => entry.id == idContactStorage.id);
    const indexInContactsArray = contactsArray.findIndex(entry => entry.id == ident);
    if (idContactStorage.id === contactsListStorage.id) {
        contactsArray.splice(indexInContactsArray, 1);
        deleteContactFromFirebase(contactsListStorage.id)
        deleteOnMobile()
        await renderLocalContactList()
        const cInfo = document.getElementById('contact_info')
        cInfo.innerHTML = contactHeadlineTemplate()
        closeEditContactDialog()
    }
}


/**
 * Adjusts the contact list and contact info visibility based on the viewport size.
 * On mobile viewports (800px or smaller), the contact info section is hidden, and the contact list is shown in full size. On larger screens, the contact info section is displayed normally.
 * This function also ensures that the contact list is not minimized.
 */
function deleteOnMobile() {
    const contactList = document.getElementById('contact_list_container')
    const contactInfo = document.getElementById('contact_info')
    contactInfo.style.display = getViewportSize() <= 800 ? "none" : "flex"
    contactList.classList.remove('minimized_contact_list')
    contactList.style.display = "flex"
}


/**
 * Deletes a contact from Firebase by its contact ID.
 * @param {string} contactID - The unique identifier of the contact to delete.
 */
async function deleteContactFromFirebase(contactID) {
    try {
        let userStorage = await fetch(BASE_URL + "contacts/" + contactID + ".json", {
            method: "DELETE",
        });

    } catch (error) {
        console.error("Fehler beim Updaten:", error);
    }
}


/**
 * Retrieves user data from Firebase.
 * @returns {Promise<any>} A promise that resolves to the user data loaded from Firebase.
 */
async function getUsersData() {
    return await loadFirebaseData('user');
}


/**
 * Retrieves task data from Firebase.
 * @returns {Promise<any>} A promise that resolves to the tasks data loaded from Firebase.
 */
async function getTasksData() {
    return await loadFirebaseData('tasks');
}