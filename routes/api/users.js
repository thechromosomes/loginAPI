  const express = require('express');
  const router = express.Router();

  //require controller
  const userController = require('../../controller/userController');


  // POST api/users/register
  router.post('/register', userController.register);

  //PUT api/users/LOGIN
  router.post('/login', userController.logIn);

  // DELETE the data
  router.delete('/delete/:id', userController.delete);

  //logout user
  router.post('logout', (req, res) => {
    res.send(`logging out from th ecurrent user id`);
  })

  module.exports = router;  