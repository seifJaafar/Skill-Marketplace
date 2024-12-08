const express = require('express');
const authController = require('../controllers/authController');
const { validateSignUp } = require("../middelwares/ValidateSignUp")
const { validateEmail } = require("../middelwares/ValidateEmail")
const { validateaddUser } = require("../middelwares/ValidateAddUser")
const { uploadFiles } = require('../utils/FileUpload');

const authorize = require("../middelwares/auth")
const roleAuthorize = require("../middelwares/roleAuth")

const router = express.Router();
router.route('/').get(authorize(), roleAuthorize("admin"), authController.GetAllusers);
router.route('/quiz-Result').post(authController.handleQuizResult);
router.route('/register').post(validateSignUp, authController.Register);
router.route('/addUser').post(authorize(), roleAuthorize('admin'), validateaddUser, authController.addUser);
router.route('/login').post(authController.LogIn);
router.route("/users").get(authorize(), roleAuthorize(['admin', 'skillprovider', 'client', 'skillexpert']), authController.getUsersPublicInfos);
router.route('/bytoken').get(authorize(), authController.ByToken);
router.route('/resetpassword').post(validateEmail, authController.ResetPassword);
router.route("/connectStripe").post(authorize(), authController.connectStripeAccount);
router.route("/updateAccount").patch(authorize(), uploadFiles, authController.updateAccount);
router.route('/updatePassword').patch(authorize(), authController.UpdatePassword);
router.route('/:id').patch(authorize(), roleAuthorize("admin"), validateaddUser, authController.UpdateUser)
    .delete(authorize(), roleAuthorize("admin"), authController.DeleteUser)
    .get(authorize(), roleAuthorize(['admin', 'skillprovider', 'client', 'skillexpert']), authController.GetUserById);

module.exports = router;