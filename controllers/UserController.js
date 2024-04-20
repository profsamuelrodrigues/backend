const User = require('../models/User.js') 
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')


const jwtSecret = process.env.JWT_SECRET

module.exports = class UserController{

     // busca todos os usuários
     static async getAlltUser (req, res){
          const user = await User.find()
          res.status(200).json(user)
     }

     //gera token do usuário
     static generateToken(id){
          return jwt.sign(
          {id}, 
          jwtSecret, 
          {expiresIn:'7d'}
          )
     }

     // registra um usuário
     static async register(req, res){
          const {name, email, password} = req.body
     
          //verifica se o usuário já existe no sistema
          const user = await User.findOne({email})
     
          if (user) {  
               res.status(422).json({errors:['Email já cadastrado']})
               return
          }
     
          //gera senha hash
          const salt = await bcrypt.genSalt()

          const passwordHash = await bcrypt.hash(password, salt)
          
          //cria um usuário
          const newUser = await User.create({
               name,
               email,
               password: passwordHash
          }) 
     
          //cerifica se o usuáriofoi criado com sucesso e retorna o token 
          if (!newUser) {
               res.status(422).json({errors:['Erro inesperado. Favor tentar novamnete.']})
               return
          }
     
          res.status(201).json({
               _id: newUser._id,
               token: generateToken(newUser)
          })
     }
     
     //loga o usuário no sistema
     static async login(req, res){
          const {email, password} = req.body
     
          const user = await User.findOne({email})
     
          //verifica se o usuário existe
          if (!user) {
               res.status(404).json({errors:['Usuário não encontrado.']})
               return
          }
     
          //verifica as senhas
          if (!(await bcrypt.compare(password, user.password))) {
               res.status(422).json({errors:['Senha inválida.']})
               return
          }
     
          //retorna o usuário com o token
          res.status(201).json({
               _id: user._id,
               profieImage: user.profileImage,
               token: generateToken(user._id)
          })
     }

     // pega o usuário logado
     static getCurrentUser(req, res){
          const user = req.user
          res.status(200).json(user)
     }

     //atualiza um usuário
     static async update(req, res){
          const {name, password, bio} = req.body 
          let profileImage = null
     
          const reqUser = req.user
          
          if (req.file) {
          profileImage = req.file.filename
          }
     
          const user = await User.findById(new mongoose.Types.ObjectId(reqUser._id)).select('-password')
     
          if (name) {
               user.name = name
          }
     
          if (password) {
               //gera senha hash
               const salt = await bcrypt.genSalt()
               const passwordHash = await bcrypt.hash(password, salt)
               user.password = passwordHash
          }
     
          if (profileImage) {
               user.profileImage = profileImage
          }
     
          if (bio) {
               user.bio = bio
          } 
          
          await user.save()
     
          res.status(200).json(user)
     }

     // busca um usuário pelo id
     static async getUserById(req, res){
          const {id} = req.params

          try {
               const user = await User.findById(new mongoose.Types.ObjectId(id)).select('-password')

               if(!user) {
                    res.status(404).json({errors:['Usuário não encontrado']}) 
                    return
               }

               res.status(200).json(user)

          } catch (error) {
               res.status(404).json({errors:['Usuário não encontrado']}) 
               return 
          }
     }

}












