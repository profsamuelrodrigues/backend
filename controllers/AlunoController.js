const Aluno = require('../models/Aluno.js') 
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')


const jwtSecret = process.env.JWT_SECRET

module.exports = class AlunoController{

     // busca todos os usuários
     static async getAlltAluno (req, res){
          const alunos = await Aluno.find()
          res.status(200).json(alunos)
     }

     //gera token do usuário
     generateToken(id){
          return jwt.sign(
          {id}, 
          jwtSecret, 
          {expiresIn:'7d'}
          )
     }

       // registra um usuário
     static async clonar(req, res){
          const {nome, matricula, turma} = req.body
     
          //verifica se o usuário já existe no sistema
          const aluno = await Aluno.findOne({matricula})
     
          if (aluno) {  
               res.status(422).json({errors:['matricula já cadastrada']})
               return
          }
        
          //cria um usuário
          const newAluno = await Aluno.create({
               nome,
               matricula,
               turma,
          }) 
     
     }
     

     // registra um usuário
     static async register(req, res){
          const {nome, matricula, senha, turma} = req.body
     
          //verifica se o usuário já existe no sistema
          const aluno = await Aluno.findOne({matricula})
     
          if (aluno) {  
               res.status(422).json({errors:['matricula já cadastrada']})
               return
          }
     
          //gera senha hash
          const salt = await bcrypt.genSalt()

          const senhaHash = await bcrypt.hash(senha, salt)
          
          //cria um usuário
          const newAluno = await Aluno.create({
               nome,
               matricula,
               senha: senhaHash,
               turma,
          }) 
     
          //cerifica se o usuáriofoi criado com sucesso e retorna o token 
          if (!newAluno) {
               res.status(422).json({errors:['Erro inesperado. Favor tentar novamnete.']})
               return
          }

          const id = newAluno._id

          const token =  jwt.sign(
               {id}, 
               jwtSecret, 
               {expiresIn:'7d'}
          )
     
          res.status(201).json({
               _id: newAluno._id,
               token
          })
     }
     
     //loga o usuário no sistema
     static async login(req, res){
          const {matricula, senha} = req.body
     
          const aluno = await Aluno.findOne({matricula})
     
          //verifica se o usuário existe
          if (!aluno) {
               res.status(404).json({errors:['Usuário não encontrado.']})
               return
          }
     
          //verifica as senhas
          if (!(await bcrypt.compare(senha, aluno.senha))) {
               res.status(422).json({errors:['Senha inválida.']})
               return
          }
     
          //retorna o usuário com o token
          res.status(201).json({
               _id: aluno._id,
               profieImage: aluno.profileImage,
               token: generateToken(aluno._id)
          })
     }

     // pega o usuário logado
     static getCurrentAluno(req, res){
          const aluno = req.aluno
          res.status(200).json(aluno)
     }

     //atualiza um usuário
     static async update(req, res){
          const {nome, senha, bio} = req.body 
          let profileImage = null
     
          const reqAluno = req.aluno
          
          if (req.file) {
          profileImage = req.file.filename
          }
     
          const aluno = await Aluno.findById(new mongoose.Types.ObjectId(reqAluno._id)).select('-password')
     
          if (nome) {
               aluno.nome = nome
          }
     
          if (senha) {
               //gera senha hash
               const salt = await bcrypt.genSalt()
               const senhaHash = await bcrypt.hash(senha, salt)
               aluno.senha = senhaHash
          }
     
          if (profileImage) {
               aluno.profileImage = profileImage
          }
          
          await aluno.save()
     
          res.status(200).json(aluno)
     }

     // busca um usuário pelo id
     static async getAlunoById(req, res){
          const {id} = req.params

          try {
               const aluno = await Aluno.findById(new mongoose.Types.ObjectId(id)).select('-senha')

               if(!aluno) {
                    res.status(404).json({errors:['Usuário não encontrado']}) 
                    return
               }

               res.status(200).json(aluno)

          } catch (error) {
               res.status(404).json({errors:['Usuário não encontrado']}) 
               return 
          }
     }

}












