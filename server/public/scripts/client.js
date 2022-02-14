$(document).ready(onReady);

let counter = 0;
let completedCount = 0;
let DateTime = luxon.DateTime;

function onReady() {
    $('#submitBtn').on('click', taskSubmit);
    $('#taskContainer').on('click', '.close', confirmDelete);
    $('#taskContainer').on('click', '.markCompleted', markComplete);
    $('#completedSection').on('click', '.close', confirmDelete);
    $('#deleteComplete').on('click', deleteHistoryConfirm);
    $('#taskContainer').on('click', '.changePrio', changePriority);
    $('#tabComplete').on('click', displayComplete);
    $('#tabTasks').on('click', displayTasks);
    $('#completedCont').hide(); // Hide the completed section on load
    $('#taskContainer').on('click', '.taskBox', showOptions);
    getTasks();
}

function getTasks() { // Refreshes task list on each call
    $('.inputs').val(''); 
    $.ajax({
        method: 'GET',
        url: '/tasks'
    }).then(response => {
        console.log('Got Tasks', response);
        renderTasks(response);
    }).catch(error => {
        console.log('Error Getting Tasks', error);
    })
}

function renderTasks(res) {
    $('.taskBox').not('.dontDelete').remove();
    $('#completedSection').empty();
    for (let task of res) {
        if (task.completed === false) { // Rendering all non completed tasks to one section
            if (task.priority === 'High') { //splits up task based on priority
                $('#highPriorityDiv').append(`
            <div class="highTask taskBox" data-id=${task.id}>
                    <button type="button" class="close" aria-label="Close" data-id=${task.id} data-target="confirmDeletion"><span aria-hidden="true">&times;</span></button>
                    <h4>${task.task}</h4>
                    <p>${task.notes}</p>
                <div class="options">
                <div class="change-prio change-prio-cont-high">
                    <p>Priority <i class="fa-solid fa-arrow-right changePrio" data-id=${task.id} data-priority="${task.priority}"></i></p>
                </div>
                <div class="markCompleted" data-id=${task.id}>
                    <p>Mark Completed</p>
                </div>
                </div>
            </div>`);
            } else if (task.priority === 'Medium') {
                $('#mediumPriorityDiv').append(`
            <div class="mediumTask taskBox" data-id=${task.id}>
                    <button type="button" class="close" aria-label="Close" data-id=${task.id}><span aria-hidden="true">&times;</span></button>
                    <h4>${task.task}</h4>
                    <p>${task.notes}</p>
                <div class="options">
                <div class="change-prio change-prio-cont-med">
                    <p><i class="fa-solid fa-arrow-left changePrio" data-id=${task.id} data-priority="${task.priority}" data-direction="left"></i> Priority <i class="fa-solid fa-arrow-right changePrio" data-id=${task.id} data-priority="${task.priority}" data-direction="right"></i></p>
                </div>
                <div class="markCompleted medMark" data-id=${task.id}>
                    <p>Mark Completed</p>
                </div>
                </div>
            </div>`);
            } else if (task.priority === 'Low') {
                $('#lowPriorityDiv').append(`
            <div class="lowTask taskBox" data-id=${task.id}>
                    <button type="button" class="close" aria-label="Close" data-id=${task.id}><span aria-hidden="true">&times;</span></button>
                    <h4>${task.task}</h4>
                    <p>${task.notes}<p>
                <div class="options">
                <div class="change-prio change-prio-cont-low">
                    <p><i class="fa-solid fa-arrow-left changePrio" data-id=${task.id} data-priority="${task.priority}"></i> Priority</p>
                </div>
                <div class="markCompleted lowMark" data-id=${task.id}>
                    <p>Mark Completed</p>
                </div>
                </div>
            </div>`);
            }
        } else { // If task is set to completed, append to the completed section
            $('#completedSection').append(` 
            <div class="completedTask" data-id=${task.id}>
            <button type="button" class="close" aria-label="Close" data-id=${task.id}><span aria-hidden="true">&times;</span></button>
                <h3>${task.task}</h3>
                <p>${task.notes}<p>
                <p>${task.priority}</p>
                <h5>Time Completed: <br>${task.time}</h5>
            </div>`);
        } 
    }
    counter = $('.taskBox').length; //Counts total task in the active section
    completedCount = $('.completedTask').length; //Counts total tasks in the completed section
    $('#completeCount').empty(); //Clear the task box on completed before reload
    $('#taskCount').empty();//clear the task box in active before reload
    $('#taskCount').append(counter); // Append active tasks count
    $('#completeCount').append(completedCount); // Append completed tasks countcount
    displayTasks(); // Run the render tasks function
}

function taskSubmit() {
    let newTask = {}; //Store the values in an object
        newTask.task = $('#taskIn').val(),
        newTask.notes = $('#notesIn').val(),
        newTask.priority = $('#prioritySel').val();
    if (newTask.task && newTask.priority) { // Requires task and priority be entered
        addTask(newTask); // Pass object into the ajax POST request function
    } else if (newTask.task === '' && newTask.priority === null) { //If task and priority isn't entered, trigger alert to enter both.
        Swal.fire('Please enter a task and priority');
    } else if(newTask.task && newTask.priority === null) { // If task is entered but no priority, alert user
        Swal.fire('Please enter a priority');
    } else if (newTask.task === '' && newTask.priority) { // if priority is selected but no task is entered, alert user.
        Swal.fire('Please enter a task');
    }
}

function addTask(taskIn) {
    $.ajax({
        method: 'POST',
        url: '/tasks',
        data: taskIn
    }).then(function (response) {
        getTasks();
    }).catch(function (error) {
        console.log('Error Adding Task', error);
        alert('Unable To Add Task')
    })
}

function deleteTask(id) {
    let taskId = id; // passes ID in from the confirmation function
        $.ajax({
            type: 'DELETE',
            url: `/tasks/${taskId}`
        }).then(response => {
            getTasks();
        }).catch(error => {
            console.log('Unable to delete task');
        })
}

function markComplete() {
    let taskId = $(this).data().id; // Grab data id of task you are updating
    let time = DateTime.now().toLocaleString(DateTime.DATETIME_SHORT); // Captures time of completion
    $.ajax({
        method: 'PUT',
        url: `/tasks/${taskId}`, // Pass database ID into the url params
        data: {
            time: time // Pass time completed into server to be stored in database
        }
    }).then(response => {
        getTasks(); // get updated task list
    }).catch(error => {
        console.log('Failed to mark as complete');
    });
}

function deleteHistoryConfirm() {
    Swal.fire({ // Sweet Alert pop up to confirm deletion request
        title: 'Confirm Deletion Of Task',
        showCancelButton: true,
        confirmButtonColor: '#bd3030',
        cancelButtonColor: '#bfbfbf',
        confirmButtonText: 'Delete'
    }).then((result) => {
    if (result.isConfirmed) {
        deleteHistory(); // Will run the deleteHistory function if user hits confirm
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'All Tasks Deleted',
            showConfirmButton: false,
            timer: 1500
            });
        }
    });
}

function deleteHistory() {
        $.ajax({
            method: 'DELETE',
            url: '/tasks'
        }).then(response => {
            getTasks();
        }).catch(error => {
            console.log('Failed to delete.');
        })
    }

function changePriority() {
    let id = $(this).data().id; // Grab ID of selected task
    let priority = $(this).data().priority; // Grab priority of current task
    let direction = $(this).data().direction; // Grab which direction the button was
    $.ajax({
        method: 'PUT',
        url: `/tasks/priority/${id}`,
        data: {
            priority: priority,
            direction: direction
        }
    }).then(response => {
        getTasks(); // Refresh task
    }).catch(error => {
        console.log('Error changing priority', error);
    })
}

function displayComplete() { // Toggles between the active and completed tasks
    $('#tabComplete').addClass('disabled'); // 
    $('#tabTasks').removeClass('disabled');
    $('#taskContainer').hide();
    $('#completedCont').show();
}

function displayTasks() { // Toggles between the active and completed tasks
    $('#tabTasks').addClass('disabled');
    $('#tabComplete').removeClass('disabled');
    $('#completedCont').hide();
    $('#taskContainer').show();
}

function confirmDelete() {
    let id = $(this).data().id; // Grab id of task box asking to be deleted
    Swal.fire({
        title: 'Confirm Deletion Of Task',
        showCancelButton: true,
        confirmButtonColor: '#bd3030',
        cancelButtonColor: '#bfbfbf',
        confirmButtonText: 'Delete'
    }).then((result) => {
    if (result.isConfirmed) {
        deleteTask(id); // pass id into the delete function if user clicks confirm
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Task Deleted',
            showConfirmButton: false,
            timer: 1500
            });
        }
    });
}

function showOptions() {
    $(this).find('.options').slideToggle("slow");
};
