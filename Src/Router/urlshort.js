const express = require('express')
const route = express.Router()
const auth = require('../Utilities/auth').auth

const urlController = require('../Controllers/urlshortner')

route
  .route('/create')
  .post(urlController.create)
route
  .route('/update')
  .patch(auth, urlController.update)

route
  .route('/info')
  .get(auth, urlController.info)

route
  .route("/r")
  .get(urlController.codes)

module.exports = route
