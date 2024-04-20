const express = require('express')
const router = express.Router()

//controller
//const {register, login, getCurrentUser, update, getUserById} = require('../controllers/UserController.js')

//midleware
/* const validate = require('../midleware/handlevalidation.js')
const {userCreateValidation, loginValidation, userUpdateValidation} = require('../midleware/userValidation.js')
const authGuard = require('../midleware/authGuard.js')
const imageUpload = require('../midleware/imageUpload.js') */

//routes
/* router.post('/register', userCreateValidation(), validate, register)
router.post('/login', loginValidation(), validate, login)
router.get('/profile', authGuard, getCurrentUser)
router.put('/', authGuard, userUpdateValidation(), validate, imageUpload.single('profileImage'), update)
router.get('/:id', getUserById) */


module.exports = router