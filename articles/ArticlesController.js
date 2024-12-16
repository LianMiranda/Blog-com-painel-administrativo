const express = require('express');
const router = express.Router();

router.get('/articles', (req, res) => {
    res.send('PAGINA DE ARTIGOS')
})

router.get('/admin/articles/new', (req, res) => {
    res.send('PAGINA PARA CRIAR NOVOS ARTIGOS')
})

module.exports = router