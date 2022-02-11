$(document).ready(onReady);

function onReady() {
    $('#submitBtn').on('click', addTask)
    getTasks();
}

function getTasks() {
    $.ajax({
        method: 'GET',
        url: '/tasks'
    }).then(response => {
        console.log('Got Tasks', response);
        renderTasks();
    }).catch(error => {
        console.log('Error Getting Tasks', error);   
    })
}