const mongoose = require('mongoose')
//require ('dotenv').config()


const DB_CONECT = "mongodb+srv://profsamuelrodrigues:A1208z.,@cluster0.wmdy9lc.mongodb.net/dbAlunos"
//CONECT="mongodb://localhost:27017/dbAlunos"

const conn = async ()=>{
    try {
        const dbCon = await mongoose.connect(DB_CONECT)
        console.log('Conectado ao Banco de Dados')
        return dbCon
    } catch (error) {
        console.log(error)
    }
}

conn()

module.exports = conn