require ('dotenv').config();
const express = require('express');
const app = express();
const {json} = require('body-parser');
const massive = require('massive');
const session = require('express-session');
const {register, login, logout} = require('./controller/authController');
const {dragonTreasure, getUserTreasure, addUserTreasure, getAllTreasure} = require('./controller/treasureController');
const {usersOnly, adminsOnly} = require('./middleware/authMiddleware');

const {SESSION_SECRET, CONNECTION_STRING} = process.env;

app.use(json());

massive(CONNECTION_STRING).then(db => {
  app.set('db', db)
  console.log('db connected');
})
app.use(session({
  secret: SESSION_SECRET,
  resave: true,
  saveUninitialized: false
}))

app.post('/auth/register', register);
app.post('/auth/login', login);
app.get('/auth/logout', logout);

app.get('/api/treasure/dragon', dragonTreasure);
app.get('/api/treasure/user', usersOnly, getUserTreasure);
app.post('/api/treasure/user', usersOnly, addUserTreasure);
app.get('/api/treasure/all', usersOnly, adminsOnly, getAllTreasure);

app.listen(4000, () => {
  console.log("listening on 4000");
})