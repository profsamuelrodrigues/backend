const express = require('express')
const router = express.Router()

//controller
const UserController = require('../controllers/UserController.js')

//midleware//
//const validate = require('../midleware/handlevalidation.js')
const UserValidation = require('../midleware/UserValidation.js')

//routes
router.get('/',  UserController.getAlltUser)
router.post('/register', UserValidation.userCreateValidation(), UserValidation.validate, UserController.register)
router.post('/login', UserValidation.loginValidation(), UserValidation.validate,  UserController.login)
router.get('/profile', UserValidation.authGuard,  UserController.getCurrentUser)
router.put('/', UserValidation.authGuard, UserValidation.userUpdateValidation(), UserValidation.validate, UserValidation.imageUpload.single('profileImage'),  UserController.update)
router.get('/:id',  UserController.getUserById)


module.exports = router
