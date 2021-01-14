require('dotenv').config();
const {SERVER_PORT, CONNECTION_STRING, SESSION_SECRET} = process.env
const express = require('express'),
      massive = require('massive'),
      authCrtl = require('./controllers/authController'),
      session = require('express-session'),
      port = SERVER_PORT,
      app = express();

app.use(express.json());

app.use(session({
   resave: false,
   saveUninitialized: true,
   secret: SESSION_SECRET,
   cookie: {maxAge: 1000 * 60 * 60 * 24}
}))

massive({
   connectionString: CONNECTION_STRING,
   ssl: {rejectUnauthorized: false}
}).then(db => {
   app.listen(port, () => console.log(`Server running on ${port}`));
   app.set('db', db);
   console.log('db connected')
})

app.post('/auth/register', authCrtl.register);
app.post('/auth/login', authCrtl.login);
app.get('/auth/logout', authCrtl.logout);