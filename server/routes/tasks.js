const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');

router.get('/', (req, res) => {
    let queryText = `
    SELECT * FROM "tasks"
    ORDER BY CASE 
         WHEN priority = 'High' THEN 1
         WHEN priority = 'Medium' THEN 2
         WHEN priority = 'Low' THEN 3
         END ASC;
    `;
    pool.query(queryText).then(result => {
        res.send(result.rows);
    }).catch(error => {
        console.log('Error getting data', error);
        res.sendStatus(500)
    })
})

router.post('/', (req, res) => {
    let newTask = req.body;
    let queryText = `
        INSERT INTO "tasks" ("task", "notes", "priority")
        VALUES ($1, $2, $3);`;
        pool.query(queryText, [newTask.task, newTask.notes, newTask.priority])
        .then(result => {
            res.sendStatus(201);
        }).catch(err => {
            res.sendStatus(500)
        })
})

router.delete('/:id', (req, res) => {
    let taskId = req.params.id;
    let queryText = `DELETE FROM "tasks" WHERE "id" = $1;`;
    pool.query(queryText, [taskId])
    .then(result => {
        res.sendStatus(200);
    }).catch(err => {
        res.sendStatus(500);
    })
})

router.put('/:id', (req, res) => {
    let taskId = req.params.id;
    let time = req.body.time
    console.log(time);
    let queryText = `UPDATE "tasks" SET "completed" = 'TRUE', "time" = $1 WHERE "id" = $2;`;
    pool.query(queryText, [time, taskId])
    .then(result => {
        res.sendStatus(200);
    }).catch(error => {
        res.sendStatus(500);
    })
})


router.delete('/', (req, res) => {
    let queryText = `DELETE FROM "tasks" WHERE "completed" = true;`;
    pool.query(queryText).then(function(response) {
        res.sendStatus(201);
    }).catch(function(error){
        res.sendStatus(500);
    })
})

router.put('/priority/:id', (req, res) => {
    let id = req.params.id;
    let currentPriority = req.body.priority;
    let direction = req.body.direction;
    if (currentPriority === 'High') {
        sqlTxt = `
        UPDATE "tasks"
        SET "priority" = 'Medium'
        WHERE "id" = $1;
        `
    } else if (currentPriority === 'Low') {
        sqlTxt = `
        UPDATE "tasks"
        SET "priority" = "Medium"
        WHERE "id" = $1;
        `
    }else if (currentPriority === 'Medium' && direction === 'right') {
        sqlTxt = `
        UPDATE "tasks"
        SET "priority" = "Low"
        WHERE "id" = $1;
        `
    }else if (currentPriority === "Medium" && direction === 'left') {
        sqlTx = `
        UPDATE "tasks"
        SET "priority" = "High"
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