/**
 * Initializes the application on page load.
 *
 * Verifies whether an active user session exists and redirects if not.
 * Loads and renders shared UI components (sidebar, navbar, mobile footer).
 * Highlights the currently active navigation link.
 */
function init() {
    isActiveUserSet()
    loadSidebar();
    loadNavbar();
    loadMobileFooter();
    highlightActiveLink();
}


/**
 *  Check if an active user is set, if not then redirect to login
 *
 *  @function isActiveUserSet
 *  @returns {void} - This function does not return a value.
 */
function isActiveUserSet() {
    const activeUser = localStorage.getItem("activeUser");
    let pagenow = window.location.href
    let bool = false
    if (pagenow.includes("legal_notice") || pagenow.includes("privacy_policy")) bool = true
    if (!activeUser && bool == false) {
        pagenow = "index.html"
        window.location.href = pagenow
    }
}


/**
 *  Loads and renders the sidebar login template into the sidebar container.
 *
 *  @function loadSidebar
 *  @returns {void} - This function does not return a value.
 */
function loadSidebar() {
    const sidebar = document.getElementById('id_sidebar');
    sidebar.innerHTML = "";
    let user = JSON.parse(localStorage.getItem('activeUser'));

    sidebar.innerHTML = user ? sidebarLoginTemplate() : sidebarLogOffTemplate();
}


/**
 *  Loads and renders the navbar template into the navbar container.
 *
 *  @function loadNavbar
 *  @returns {void} - This function does not return a value.
 */
function loadNavbar() {
    const navbar = document.getElementById('id_navbar');
    navbar.innerHTML = "";
    let user = JSON.parse(localStorage.getItem('activeUser'));

    navbar.innerHTML = user ? navbarTemplate(user.initials) : navbarLogOffTemplate()
}


/**
 *  Loads and renders the mobile footer template for logged-in users.
 *
 *  @function loadMobileFooter
 *  @returns {void} - This function does not return a value.
 */
function loadMobileFooter() {
    const footer = document.getElementById('mobile_footer');
    if (!footer) return;

    footer.innerHTML = "";
    let user = JSON.parse(localStorage.getItem('activeUser'));

    footer.innerHTML = user ? mobileFooterLoginTemplate() : mobileFooterLogoffTemplate()

}


/**
 *  Loads and renders the summary content template into the main content area.
 *
 *  @function loadSummary
 *  @returns {void} - This function does not return a value.
 */
function loadSummary() {
    let user = JSON.parse(localStorage.getItem('activeUser'));
    let greetingText = getGreeting();
    let userName = "";
    if (user && user.name !== "Guest") {
        greetingText = greetingText + ",";
        userName = user.name;
    } else {
        greetingText = greetingText + "!";
        userName = "";
    }
    const summaryContent = document.getElementById('id_content_summary');
    summaryContent.innerHTML = summaryContentTemplate(userName, greetingText);
    const shouldShowAnimation = localStorage.getItem("showMobileGreeting") === "true";
    handleSummaryView(shouldShowAnimation);
}


/**
 *  Determines the greeting based on the current time of day.
 */
function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
}


/**
 *  Loads and renders the log-off sidebar template into the sidebar container.
 *
 *  @function loadLogOffSidebar
 *  @returns {void} - This function does not return a value.
 */
function loadLogOffSidebar() {
    const sidebar = document.getElementById('id_sidebar');
    sidebar.innerHTML = "";
    sidebar.innerHTML = sidebarLogOffTemplate();
}


/**
 *  Toggles the visibility of the navbar menu.
 *  Adds or removes the CSS class "d_none" to show or hide the menu.
 *
 *  @function toggleMenu
 *  @returns {void} - This function does not return a value.
 */
function toggleMenu() {
    document.getElementById("menu_navbar").classList.toggle("d_none");
}


/**
 * Schließt das Navbar-Menü, wenn der Nutzer außerhalb des Menüs klickt.
 */
window.addEventListener('click', function (e) {
    let menu = document.getElementById("menu_navbar");
    if (menu && !menu.classList.contains("d_none")) {
        let clickInsideMenu = menu.contains(e.target);
        let clickOnToggle = e.target.closest("[onclick*='toggleMenu']");
        if (!clickInsideMenu && !clickOnToggle) {
            menu.classList.add("d_none");
        }
    }
});


/**
 *  Adds a click listener to all <dialog> elements on the page.
 *  Closes the dialog when the user clicks on the dialog backdrop (outside the dialog content) and clears all contact input fields.
 *
 *  @event click
 *  @returns {void} - This function does not return a value.
 */
document.querySelectorAll('dialog').forEach(dialog => {
    dialog.addEventListener('click', event => {
        if (event.target === dialog) {
            dialog.close();
            clearContactInputs();
        }
    });
});


/**
 *  Navigates to the previously visited page in the browser history.
 *
 *  @function goBack
 *  @returns {void} - This function does not return a value.
 */
function goBack() {
    window.history.back();
}


/**
 *  Returns the next color from the predefined color list.
 *  Cycles through the colors array sequentially and starts again from the beginning once the end is reached.
 *
 *  @function getRandomColor
 *  @returns {string} - A color value from the colors array.
 */
function getRandomColor() {
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
}


/**
 * Sets up validation for date input fields in task forms.
 * Limits dates to a minimum of "2026-01-01" and a maximum of "2030-12-31".
 */
function setupDateValidation() {
    const ids = ['id_due_date_add_task_default', 'id_due_date_add_task_overlay', 'id_due_date_task_detail_edit'];
    ids.forEach(id => {
        const input = document.getElementById(id);
        if (!input) return;
        input.min = "2026-01-01"; input.max = "2030-12-31";
        const validate = () => {
            const msg = document.querySelector(`.required_message[data-for="${id}"]`);
            const isInvalid = !input.value || input.value < "2026-01-01";
            input.classList.toggle('error', isInvalid);
            if (msg) {
                msg.innerText = input.value ? "Date must be 2026 or later" : "This field is required";
                msg.classList.toggle('active', isInvalid);
            }
        };
        input.addEventListener('input', validate);
        input.addEventListener('blur', validate);
    });
}


/**
 * Adds custom click behavior to date input fields.
 * When the user clicks near the right edge of the input (last 45px), this triggers the native date picker if available.
 */
function setupDateClickBehavior() {
    const ids = ['id_due_date_add_task_default', 'id_due_date_add_task_overlay', 'id_due_date_task_detail_edit'];
    ids.forEach(id => {
        const input = document.getElementById(id);
        if (!input) return;
        input.addEventListener('click', function (e) {
            if ((this.offsetWidth - e.offsetX) < 45 && e.isTrusted) {
                if (!this.disabled && !this.readOnly && this.offsetParent !== null) {
                    e.preventDefault();
                    this.showPicker?.();
                }
            }
        });
    });
}


/**
 * Initializes date input behavior on page load.
 */
document.addEventListener('DOMContentLoaded', () => {
    setupDateValidation();
    setupDateClickBehavior();
});


/**
 * Highlights the active sidebar link based on the current page path.
 *
 * @function highlightActiveLink
 */
function highlightActiveLink() {
    const links = document.querySelectorAll('.link_active');
    const currentPath = window.location.pathname;
    links.forEach(link => {
        const linkPath = link.getAttribute('href').replace('./', '');
        if (currentPath.includes(linkPath)) link.classList.add('active')
    })
}


/**
 *  Displays a toast notification for a short duration.
 *  Adds the CSS class "show" to the message box element to make it visible and automatically removes the class after 800 milliseconds.
 *
 *  @function showToast
 *  @returns {void} - This function does not return a value.
 */
function showToast() {
    const msgBox = document.getElementById('msgBox');
    const overlayElement = document.querySelector('dialog[open]');
    if (overlayElement) {
        overlayElement.appendChild(msgBox);
    } else {
        document.body.appendChild(msgBox);
    }
    msgBox.classList.add('show');
    setTimeout(() => {
        msgBox.classList.remove('show');
    }, 2000);
}


/**
 *  Limits the number of characters in an input or textarea element.
 *
 *  @param {HTMLInputElement|HTMLTextAreaElement} element - The input or textarea element to limit.
 *  @param {number} maxLength - The maximum number of characters allowed.
 */
function limitInputLength(element, maxLength) {
    if (element.value.length > maxLength) {
        element.value = element.value.slice(0, maxLength);
    }
}


/**
 *  Redirects the user to the board page.
 *
 *  @function goToBoardPage
 *  @returns {void} - This function does not return a value.
 */
function goToBoardPage() {
    window.location.href = "board.html";
}


/**
 *  Closes all dropdown menus when clicking outside of them.
 *
 *  @event click
 *  @param {MouseEvent} event - The click event object.
 */
document.addEventListener('click', function (event) {
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        if (!dropdown.contains(event.target)) {
            const list = dropdown.querySelector('ul');
            if (list) list.style.display = 'none';
        }
    });
});