function summaryContentTemplate(userName, greeting) {
    return `
        <div id="id_summary_metrics_container">
            <section class="order_todo_done_box margin_left">
                <div class="style_todo_done_box style_boxes style_done_box_hover" onclick="goToBoardPage()">
                    <img class="img_summary_edit_check_icon" src="./assets/img/summary_edit_icon.svg" alt="Edit Icon">
                    <div class="order_number_text">
                        <p id="id_summary_todo" class="summary_number"></p>
                        <p class="style_text">To Do</p>
                    </div>
                </div>
                <div class="style_todo_done_box style_boxes style_todo_box_hover" onclick="goToBoardPage()">
                    <img class="img_summary_edit_check_icon" src="./assets/img/summary_check_icon.svg" alt="Check Icon">
                    <div class="order_number_text">
                        <p id="id_summary_done" class="summary_number"></p>
                        <p class="style_text">Done</p>
                    </div>
                </div>
            </section>
            
            <section class="box_prio_tickets margin_left style_boxes" onclick="goToBoardPage()">
                 <div class="counter_prio_tickets">
                    <img class="board_priority_btn" src="./assets/img/summary_prio_icon.svg" alt="Priority Icon">
                    <div class="order_number_text">
                        <p id="id_summary_urgent" class="summary_number"></p>
                        <p class="style_prio_area">Urgent</p>
                    </div>
                </div>
                <div class="divider_prio_box"></div>
                <div class="deadline_information">
                    <p id="id_summary_dueDate" class="date_of_deadline"></p>
                    <p class="style_prio_area">Upcoming Deadline</p>
                </div>
            </section>

            <section class="order_ticket_box_below margin_left">
                 <div class="order_number_text style_boxes boxes_last_row" onclick="goToBoardPage()">
                        <p id="id_summary_allTasks" class="summary_number"></p>
                        <p class="style_text">Tasks in <br> Board</p>
                    </div>
                    <div class="order_number_text style_boxes boxes_last_row" onclick="goToBoardPage()">
                        <p id="id_summary_inProgress" class="summary_number"></p>
                        <p class="style_text">Tasks in <br> Progress</p>
                    </div>
                    <div class="order_number_text style_boxes boxes_last_row" onclick="goToBoardPage()">
                        <p id="id_summary_awaitFeedback" class="summary_number"></p>
                        <p class="style_text">Awaiting <br> Feedback</p>
                    </div>
            </section>
        </div>

        <div id="id_summary_greeting_container" class="order_greeting_username">
            <p class="style_greeting_text">${greeting}</p>
            <h1 class="style_username">${userName}</h1>
        </div>
    `;
}