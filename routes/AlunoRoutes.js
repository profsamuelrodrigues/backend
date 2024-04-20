const express = require('express')
const router = express.Router()

//controller
const AlunoController = require('../controllers/AlunoController.js')

//midleware//
const AlunoValidation = require('../midleware/AlunoValidation.js')

//routes
router.get('/',  AlunoController.getAlltAluno)
router.post('/register', AlunoValidation.alunoCreateValidation(), AlunoValidation.validate, AlunoController.register)
router.post('/login', AlunoValidation.loginValidation(), AlunoValidation.validate,  AlunoController.login)
router.get('/profile', AlunoValidation.authGuard,  AlunoController.getCurrentAluno)
router.put('/', AlunoValidation.authGuard, AlunoValidation.alunoUpdateValidation(), AlunoValidation.validate, AlunoValidation.imageUpload.single('profileImage'),  AlunoController.update)
router.get('/:id',  AlunoController.getAlunoById)


module.exports = router
