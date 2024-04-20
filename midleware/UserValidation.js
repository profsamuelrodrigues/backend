const {body} = require('express-validator')
const User = require('../models/User.js')
const jwt = require('jsonwebtoken')
const jwtSecret = process.env.JWT_SECRET
const {validationResult} = require('express-validator')
const multer =require('multer')
const path = require('path')

module.exports = class  UserValidation{
    static userCreateValidation(){
        return [
            body('name')
                .isString()
                .withMessage('O nome é obrigatório!')
                .isLength({min: 3})
                .withMessage('O nome precisa ter no mínimo 3 caracteres'),
            body('email')
                .isString()
                .withMessage('O email é obrigatório!')
                .isEmail()
                .withMessage('Insira um emal válido'),
            body('password')
                .isString()
                .withMessage('A senha é obrigatória!')
                .isLength({min: 5})
                .withMessage('A senha precisa ter no mínimo 5 caracteres'),
            body('confirmPassword')
                .isString()
                .withMessage('A confirmação de senha é obrigatória!')
                .custom((value, {req})=>{
                    if (value != req.body.password) {
                        throw new Error('As senhas não conferem')
                    }
    
                    return true
                })
        ]
    }

    static loginValidation(){
        return [
            body('email')
                .isString()
                .withMessage('O email é obrigatório!')
                .isEmail()
                .withMessage('Insira um emal válido'),
            body('password')
                .isString()
                .withMessage('A senha é obrigatória!')
        ]
    }

    static userUpdateValidation(){
        return [
            body('name')
            .optional()
            .isLength({min: 3})
            .withMessage('O nome precisa ter no mínimo 3 caracteres'),
            body('password')
                .optional()
                .isLength({min: 5})
                .withMessage('A senha precisa ter no mínimo 5 caracteres'),
        ]
    }

    static async authGuard(req, res, next){
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
    
        //check if header has a token
        if(!token)return res.status(401).json({errors:['Acesso negado!']})
    
        //check if token is valid
        try {
            const verified = jwt.verify(token, jwtSecret)
            req.user = await User.findById(verified.id).select('-password')
            next()
        } catch (error) {
            res.status(401).json({errors:['Token inválido!']})
    
        }
    }

    static validate(req, res, next){
        const errors = validationResult(req)

        if (errors.isEmpty()) {
            return next()
        }

        const extractedErrors = []

        errors.array().map((err)=>{extractedErrors.push(err.msg)})

        return res.status(422).json({
            errors: extractedErrors
        })
    }

    static imageUpload = multer({
        storage: multer.diskStorage({
            destination: function(req, file, cb){
                let folder = ''
                if (req.baseUrl.includes('users')) {
                    folder = 'users'
                }else if(req.baseUrl.includes('photos')){
                    folder = 'photos'
                }
        
                cb(null, `uploads/${folder}/`)
            },
            filename: (req, file, cb)=>{
                cb(null, Date.now() + path.extname(file.originalname))
            }
        }),

        fileFilter: (req,file, cb)=>{
            if (!file.originalname.match(/\.(png|jpg)$/)) {
                return cb(new Error('Favor enviar apenas arquivos png ou jpg'))
            }
            cb(undefined, true)
        }
    })
}
