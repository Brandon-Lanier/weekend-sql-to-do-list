const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');

router.get('/', (req, res) => {
    let queryText = `
    SELECT * FROM "tasks"`; // Will organize by the time it was entered
    pool.query(queryText).then(result => {
        res.send(result.rows);
    }).catch(error => {
        console.log('Error getting data', error);
        res.sendStatus(500)
    })
})

router.post('/', (req, res) => {
    let newTask = req.body; // Input from user
    let queryText = `
        INSERT INTO "tasks" ("task", "notes", "priority")
        VALUES ($1, $2, $3);`;
        pool.query(queryText, [newTask.task, newTask.notes, newTask.priority]) // sanitizing inputs for entry into DB
        .then(result => {
            res.sendStatus(201);
        }).catch(err => {
            res.sendStatus(500)
        })
})

router.delete('/:id', (req, res) => {
    let taskId = req.params.id; //ID to be deleted sent by client
    let queryText = `DELETE FROM "tasks" WHERE "id" = $1;`;
    pool.query(queryText, [taskId])
    .then(result => {
        res.sendStatus(200);
    }).catch(err => {
        res.sendStatus(500);
    })
})

router.put('/:id', (req, res) => {
    let taskId = req.params.id; //ID of completed task
    let time = req.body.time //Time the user clicked completed
    let queryText = `UPDATE "tasks" SET "completed" = 'TRUE', "time" = $1 WHERE "id" = $2;`;
    pool.query(queryText, [time, taskId])
    .then(result => {
        res.sendStatus(200);
    }).catch(error => {
        res.sendStatus(500);
    })
})

router.delete('/', (req, res) => {
    let queryText = `DELETE FROM "tasks" WHERE "completed" = true;`; // Delete all completed tasks
    pool.query(queryText).then(function(response) {
        res.sendStatus(201);
    }).catch(function(error){
        res.sendStatus(500);
    })
})

router.put('/priority/:id', (req, res) => {
    let id = req.params.id; // id of task
    let currentPriority = req.body.priority; // Current Priority of task
    let direction = req.body.direction; // Direction of arrow clicked
    console.log(id, currentPriority, direction);
    if (currentPriority === 'High') { //If current priority is high, move to medium.
        sqlTxt = `
        UPDATE "tasks"
        SET "priority" = 'Medium'
        WHERE "id" = $1;
        `
    } else if (currentPriority === 'Low') { // If current priority is low, move left to medium.
        sqlTxt = `
        UPDATE "tasks"
        SET "priority" = 'Medium'
        WHERE "id" = $1;
        `
    }else if (currentPriority === 'Medium' && direction === 'right') { // If current is medium and right clicked, move to low.
        sqlTxt = `
        UPDATE "tasks"
        SET "priority" = 'Low'
        WHERE "id" = $1;
        `
    }else if (currentPriority === "Medium" && direction === 'left') { // if current is medium and direction left, move to high
        sqlTxt = `
        UPDATE "tasks"
        SET "priority" = 'High'
        WHERE "id" = $1;
        `
    } else {
        res.sendStatus(400);
    }
    pool.query(sqlTxt, [id])
    .then(result => {
        res.sendStatus(200);
    }).catch(err => {
        res.sendStatus(500);
    })
})


module.exports = router;