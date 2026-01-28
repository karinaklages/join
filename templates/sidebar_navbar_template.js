function sidebarLoginTemplate() {
  return `
        <a class="sidebar_logo_link" href="index.html"><img class="logo_invert" src="./assets/img/logo_version2.svg" alt="Join Logo"></a>
        <div class="order_selection_privacy_legal_sidebar">
            <div class="sidebar_selection">
                <a class="order_icon_selection link_active" href="./summary.html">
                    <img class="icon_sidebar" src="./assets/img/summary_noneactivated.svg" alt="">
                    <p>Summary</p>
                </a>
                <a class="order_icon_selection link_active" href="./add_task.html">
                    <img class="icon_sidebar" src="./assets/img/add_task_grey.svg" alt="">
                    <p>Add Task</p>

                </a>
                <a class="order_icon_selection link_active" href="./board.html">
                    <img class="icon_sidebar" src="./assets/img/board_icon.svg" alt="">
                    <p>Board</p>
                </a>
                <a class="order_icon_selection link_active" href="./contacts.html">
                    <img class="icon_sidebar" src="./assets/img/contacts_icon.svg" alt="">
                    <p>Contacts</p>
                </a>
            </div>   
            <div class="sidebar_privacy_legal">
                <a class="design_privacy_legal link_active" href="privacy_policy.html">Privacy Policy</a>
                <a class="design_privacy_legal link_active" href="legal_notice.html">Legal Notice</a>
            </div>
        </div> 
    `;
}


function sidebarLogOffTemplate() {
  return `
        <a  class="sidebar_logo_link" href="index.html"><img class="logo_invert" src="./assets/img/logo_version2.svg" alt="Join Logo"></a>
        <div class="order_selection_privacy_legal_sidebar">
            <a class="style_login_icon_text" href="./index.html">
                <img src="./assets/img/log_in.svg" alt="Login">
                <p class="p_text">Log In</p>
            </a>
            <div class="sidebar_privacy_legal">
                <a class="design_privacy_legal link_active" href="privacy_policy.html">Privacy Policy</a>
                <a class="design_privacy_legal link_active" href="legal_notice.html">Legal Notice</a>
            </div>
        </div>
    `;
}


function navbarTemplate(userInitials) {
  return `
        <div class="content_wrapper order_content_navbar">  
            <img class="mobile_logo" id="header_logo" src="./assets/img/logo_version_1.svg" alt="logo image"/>
            <p class="text_navbar desktop">Kanban Projekt Management Tool</p>
            <div class="help_user_icon">
                <a href="./help.html"><img class="help_icon desktop" src="./assets/img/questionmark_small.svg" alt="Help Button"></a>
                <div class="user_circle" onclick="toggleMenu()">${userInitials}</div>
            </div>
            <div id="menu_navbar" class="menu_navbar d_none content_wrapper">
                <a href="./legal_notice.html">Legal Notice</a>
                <a href="./privacy_policy.html">Privacy Policy</a>
                <a href="./index.html" onclick="localStorage.removeItem('activeUser')">Log out</a>
            </div>
        </div>
    `;
}


function navbarLogOffTemplate() {
  return `
        <div class="content_wrapper order_content_navbar navbar_log_off">  
            <a class="sidebar_logo_link" href="index.html"><img class="mobile_logo" id="header_logo" src="./assets/img/logo_version_1.svg" alt="logo image"/></a>
            <p class="text_navbar desktop">Kanban Projekt Management Tool</p>
            <div class="help_user_icon"></div>
        </div>
    `;
}


function mobileFooterLoginTemplate() {
    return `
        <a class="mobile_footer_link link_active" href="summary.html">
            <img class="mobile_link_icon" src="assets/img/summary_noneactivated.svg" alt="summary icon"/>
            <p>Summary</p>
        </a>
        <a class="mobile_footer_link link_active" href="add_task.html">
            <img class="mobile_link_icon" src="assets/img/add_task_icon.svg" alt="add task icon"/>
            <p>Add Task</p>
        </a>
        <a class="mobile_footer_link link_active" href="board.html">
            <img class="mobile_link_icon" src="assets/img/board_icon.svg" alt="board icon"/>
            <p>Board</p>
        </a>
        <a class="mobile_footer_link link_active" href="contacts.html">
            <img class="mobile_link_icon" src="assets/img/contacts_icon.svg" alt="contacts icon"/>
            <p>Contacts</p>
        </a>
    `;
}


function mobileFooterLogoffTemplate() {
    return `
        <div class="logout_footer">
            <a href="./index.html">
                <img src="./assets/img/log_in.svg" alt="Login">
                <p class="p_text">Log In</p>
            </a>
            <div class="mobile_footer_links">
                <a class="footer_link footer_links_padding link_active" href="privacy_policy.html">Privacy Policy</a>
                <a class="footer_link footer_links_padding link_active" href="legal_notice.html">Legal Notice</a>
            </div>
        </div>
    `;
}
