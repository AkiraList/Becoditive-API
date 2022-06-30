const express = require('express')
const route = express.Router()
const auth = require('../Utilities/auth').auth

const animalController = require('../Controllers/Nsfw')

route
  .route('/img')
  .get(auth, animalController.Nsfw)

route
  .route('/')
  .get(auth, animalController.Ends)

module.exports = route