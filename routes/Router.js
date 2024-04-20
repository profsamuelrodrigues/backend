const express = require('express')
const router = express()

router.use('/users', require('./UserRoutes.js'))
router.use('/alunos', require('./AlunoRoutes.js'))

//Test router///
router.get('/', (req, res)=>{
    res.send('API rodando')
})

module.exports = router