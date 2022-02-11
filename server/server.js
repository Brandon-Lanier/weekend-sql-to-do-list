const express = require('express');
const bodyParser = require('body-parser');
const todoRouter = require('./routes/todo.js');
const PORT = process.env.PORT || 5000;
const app = express();

app.use(bodyParser.urlencoded({extended}));

app.use(express.static('server/public'))







app.listen(PORT, () => {
  console.log('listening on port', PORT);
});