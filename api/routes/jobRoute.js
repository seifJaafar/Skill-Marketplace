const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const authorize = require("../middelwares/auth")

router.route('/byClient').get(authorize(), jobController.getJobsByclient);
router.route('/byProvider').get(authorize(), jobController.getJobsByProvider);
module.exports = router;
