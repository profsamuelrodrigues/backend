const mongoose = require('mongoose')
const {Schema} = mongoose

const alunoSchema = new Schema(
    {
        nome: String,
        senha: String,
        matricula: String,
        turma: String,
        profileImage: String,
        registros: Array,
        telefones: Array,
    },
    {
        timestamps: true
    }
)

const Aluno = mongoose.model('Aluno', alunoSchema)

module.exports = Aluno