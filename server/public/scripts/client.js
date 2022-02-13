$(document).ready(onReady);

let counter = 0;
let completedCount = 0;
let DateTime = luxon.DateTime;

function onReady() {
    $('#submitBtn').on('click', taskSubmit);
    $('#taskContainer').on('click', '.fa-xmark', deleteTask);
    $('#taskContainer').on('click', '.markCompleted', markComplete);
    $('#completedSection').on('click', '.fa-xmark', deleteTask);
    $('#deleteComplete').on('click', deleteHistory);
    // $('#taskContainer').on('hover', showOptions);
    $('#taskContainer').on('click', '.changePrio', changePriority);
    $('#tabComplete').on('click', displayComplete);
    $('#tabTasks').on('click', displayTasks);
    getTasks();
    $('#completedCont').hide();
    
}

function getTasks() {
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
    // $('#taskCount').empty();
    $('.taskBox').not('.dontDelete').remove();
    // $('.priorityDiv').empty();
    $('.markCompleted').hide();
    $('#completedSection').empty();
    console.log(res);
    for (let task of res) {
    if (task.completed === false) {
        if (task.priority === 'High') {
        $('#highPriorityDiv').append(`
            <div class="highTask taskBox" data-id=${task.id}>
                <i class="fa-solid fa-xmark" data-id=${task.id}></i>
                <h3>${task.task}</h3>
                <p>${task.notes}<p>
                <p>Priority <i class="fa-solid fa-arrow-right changePrio" data-priority="${task.priority}"></i></p>
                <div class="markCompleted" data-id=${task.id}>
                <p>Mark Completed</p>
                </div>
            </div>`);
    } else if (task.priority === 'Medium') {
        $('#mediumPriorityDiv').append(`
            <div class="mediumTask taskBox" data-id=${task.id}>
                <i class="fa-solid fa-xmark" data-id=${task.id}></i>
                <h3>${task.task}</h3>
                <p>${task.notes}<p>
                <p><i class="fa-solid fa-arrow-left changePrio" data-priority="${task.priority}" data-direction="left"></i> Priority <i class="fa-solid fa-arrow-right changePrio" data-priority="${task.priority}" data-direction="right"></i></p>
                <div class="markCompleted medMark" data-id=${task.id}>
                <p>Mark Completed</p>
                </div>
            </div>`);
    } else if (task.priority === 'Low') {
        $('#lowPriorityDiv').append(`
            <div class="lowTask taskBox" data-id=${task.id}>
                <i class="fa-solid fa-xmark" data-id=${task.id}></i>
                <h3>${task.task}</h3>
                <p>${task.notes}<p>
                <p><i class="fa-solid fa-arrow-left changePrio" data-priority="${task.priority}"></i> Priority</p>
                <div class="markCompleted lowMark" data-id=${task.id}>
                <p>Mark Completed</p>
                </div>
            </div>`);
        }
    } else {
            $('#completedSection').append(`
            <div class="completedTask" data-id=${task.id}>
                <i class="fa-solid fa-xmark" data-id=${task.id}></i>
                <h3>${task.task}</h3>
                <p>${task.notes}<p>
                <p>${task.priority}</p>
                <h5>Time Completed: <br>${task.time}</h5>
            </div>`);
            }
        }
        counter = $('.taskBox').length;
        completedCount = $('.completedTask').length;
        $('#completeCount').empty();
        $('#taskCount').empty();
        $('#taskCount').append(counter)
        $('#completeCount').append(completedCount);
        displayTasks()
     }



function taskSubmit() {
    let newTask = {};
        newTask.task = $('#taskIn').val(),
        newTask.notes = $('#notesIn').val(),
        newTask.priority = $('#prioritySel').val();
        addTask(newTask);
        // $('.inputs').val('');
}

function addTask(taskIn) {
    $.ajax({
        method: 'POST',
        url: '/tasks',
        data: taskIn
    }).then(function(response){
        getTasks();
    }).catch(function(error) {
        console.log('Error Adding Task', error);
        alert('Unable To Add Task')
    })
}

function deleteTask() {
    if (confirm('Confirm Delete')) {
        let taskId = $(this).data().id;
        $.ajax({
            type: 'DELETE',
            url: `/tasks/${taskId}`
        }).then(response => {
            getTasks();
        }).catch(error => {
        console.log('Unable to delete task');
    })  
}
}

function markComplete() {
    let taskId = $(this).data().id;
    let time = DateTime.now().toLocaleString(DateTime.DATETIME_SHORT)
    console.log(time);
    console.log(taskId);
    $.ajax({
        method: 'PUT',
        url: `/tasks/${taskId}`,
        data: {time: time}
    }).then(response => {
        getTasks();
    }).catch(error => {
        console.log('Failed to mark as complete');
    });
}

function deleteHistory() {
    $.ajax({
        method: 'DELETE',
        url: '/tasks'
    }).then(response => {
        getTasks();
    }).catch(error => {
        console.log('Failed to mark as complete');
    })
}

function changePriority() {
    let id = $(this).closest('div').data().id;
    let priority = $(this).data().priority;
    let direction = $(this).data().direction;
    console.log(id, priority, direction);
    
   $.ajax({
       method: 'PUT',
       url: `/tasks/priority/${id}`,
       data: {
           priority: priority,
           direction: direction
        }
   }).then(response => {
       getTasks();
   }).catch(error => {
       console.log('Error changing priority', error);   
   })    
}

function displayComplete() {
    $('#taskContainer').hide();
    $('#completedCont').show()
}

function displayTasks() {
    $('#completedCont').hide();
    $('#taskContainer').show()
}

// function showOptions() {
//     $('.markCompleted').show()
// }