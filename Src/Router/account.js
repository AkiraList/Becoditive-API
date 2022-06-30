const express = require('express');
const session = require('express-session');
const router = express.Router()
const accountController = require('../Controllers/Account')
router
  .route('/')
  .get(accountController.login)

router
  .route('/auth')
  .post(accountController.auth)

router
  .route('/home')
  .get(accountController.home)
router
  .route('/dash')
  .get(accountController.dash)

module.exports = router