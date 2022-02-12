$(document).ready(onReady);

let counter = 0;
let DateTime = luxon.DateTime;

function onReady() {
    $('#submitBtn').on('click', taskSubmit);
    $('#taskContainer').on('click', '.deleteBtn', deleteTask);
    $('#taskContainer').on('click', '.completeBtn', markComplete);
    $('#completedSection').on('click', '.deleteBtn', deleteTask);
    $('#deleteHistoy').on('click', deleteHistory)
    getTasks();
    
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
    counter = res.length;
    console.log(counter);
    $('.priorityDiv').empty();
    $('#completedSection').empty();
    console.log(res);
    for (let task of res) {
    if (task.completed === false) {
        if (task.priority === 'High') {
        $('#highPriorityDiv').append(`
            <div class="highTask taskCont" data-id=${task.id}>
                <h3>${task.task}</h3>
                <p>${task.notes}<p>
                <p>${task.priority}</p>
                <td><span class="completed"></span><button class="completeBtn" data-id=${task.id}>Mark Completed</button></td>
                <button class="deleteBtn" data-id=${task.id}>Delete</button>
            </div>`);
    } else if (task.priority === 'Medium') {
        $('#mediumPriorityDiv').append(`
            <div class="mediumTask" data-id=${task.id}>
                <h3>${task.task}</h3>
                <p>${task.notes}<p>
                <p>${task.priority}</p>
                <button class="completeBtn" data-id=${task.id}> Mark Completed</button>
                <button class="deleteBtn" data-id=${task.id}>Delete</button>
            </div>`);
    } else if (task.priority === 'Low') {
        $('#lowPriorityDiv').append(`
            <div class="lowTask" data-id=${task.id}>
                <h3>${task.task}</h3>
                <p>${task.notes}<p>
                <p>${task.priority}</p>
                <span class="completed"></span><button class="completeBtn" data-id=${task.id}>Mark Completed</button>
                <button class="deleteBtn" data-id=${task.id}>Delete</button>
            </div>`);
        }
    } else {
            $('#completedSection').append(`
            <div class="completedTask" data-id=${task.id}>
                <h3>${task.task}</h3>
                <p>${task.notes}<p>
                <p>${task.priority}</p>
                <p>Time Completed: ${task.time}</p>
                <button class="deleteBtn" data-id=${task.id}>Delete</button>
            </div>`);
            }
        }$('#taskCount').append(counter)
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
