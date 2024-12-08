const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const authorize = require("../middelwares/auth")
const roleAuthorize = require("../middelwares/roleAuth")
router.route('/byClient').get(authorize(), roleAuthorize(['admin', 'skillprovider','client','skillexpert']), jobController.getJobsByclient);
router.route('/byProvider').get(authorize(),  roleAuthorize(['admin', 'skillprovider','client','skillexpert']),jobController.getJobsByProvider);
module.exports = router;
