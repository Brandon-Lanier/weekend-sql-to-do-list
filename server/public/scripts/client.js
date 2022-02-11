$(document).ready(onReady);

function onReady() {
    $('#submitBtn').on('click', taskSubmit)
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
    $('#tableBody').empty();
    for (let task of res) {
        $('#tableBody').append(`
            <tr data-id=${task.id}>
                <td>${task.task}</td>
                <td>${task.notes}</td>
                <td>${task.priority}</td>
                <td><span class="completed"></span><button class="completeBtn" data-id=${task.id}>Mark Completed</button></td>
                <td><button class="deleteBtn" data-id=${task.id}>Delete</button>
            </tr>
        `);
    }
}

function taskSubmit() {
    let newTask = {};
        newTask.task = $('#taskIn').val(),
        newTask.notes = $('#notesIn').val(),
        newTask.priority = $('#prioritySel').val();
        console.log(newTask);
        addTask(newTask);
        // $('.inputs').val('');
}

function addTask(taskIn) {
    console.log(taskIn);
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

function