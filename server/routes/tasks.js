const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');

router.get('/', (req, res) => {
    let queryText = `SELECT * FROM "tasks" ORDER BY "priority";`;
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

router.delete('/:id' (req, res) {
    let taskId = req.params.id
})





module.exports = router;