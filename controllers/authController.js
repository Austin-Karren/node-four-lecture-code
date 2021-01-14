const bcrypt = require('bcryptjs');

module.exports = {
   register: async(req, res) => {
      const {email, password} = req.body;
      const db = req.app.get('db');

      let user = await db.check_user(email);
      if(user[0]){
         return res.status(400).send('Email already exists')
      }
      let salt = bcrypt.genSaltSync(10);
      let hash = bcrypt.hashSync(password, salt);

      let newUser = await db.register_user({email, password: hash})
      req.session.user = newUser[0];

      res.status(201).send(req.session.user);
   },
   login: async(req, res) => {
      const {email, password} = req.body;
      const db = req.app.get('db');

      let user = await db.check_user(email);
      if(!user[0]){
         return res.status(400).send('User does not exist')
      }

      const authenticated = bcrypt.compareSync(password, user[0].password)
      if(!authenticated){
         return res.status(400).send('Password is incorrect')
      }
      delete user[0].password;
      req.session.user = user[0];
      res.status(202).send(req.session.user)
   },
   logout: (req, res) => {
      req.session.destroy();
      res.sendStatus(200);
   }
}