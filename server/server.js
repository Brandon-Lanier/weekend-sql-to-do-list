const express = require('express');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 5000;
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(express.static('server/public'));

const taskRouter = require('./routes/tasks.js');
app.use('/tasks', taskRouter);

app.listen(PORT, () => {
  console.log('listening on port', PORT)
})