const express = require('express');
const router = express.Router();

//load middleware function to auth user
const auth = require('../../middleware/authUser');

//require profile controller
const profileController = require('../../controller/profileController');

// POST data to be sent to database
router.post('/', auth, profileController.post);

//GET fetch the data from database
router.get('/', auth, profileController.fetch);

// PUT to update the profile data
router.put('/', auth, profileController.update);

//DELETE to delete the profile data
router.delete('/', auth, profileController.delete);


module.exports = router;
