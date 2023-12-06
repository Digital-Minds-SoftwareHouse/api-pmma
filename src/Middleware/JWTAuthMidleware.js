const jwt = require('jsonwebtoken')
//require('dotenv-safe').config()

module.exports = function verifyJWT(req, res, next) {
    const token = req.headers['x-access-token']
    if(!token) return res.status(401).send({auth:false, message: 'TOKEN DE AUTENTICAÇÃO AUSENTE!'})  
    jwt.verify(token, process.env.SECRET, function(err, decoded){
        if(err)return res.status(400).send({auth: false, message: 'FALHA NA AUTENTICAÇÃO DA REQUISIÇÃO'})
        req.userId = decoded.id
        next()
    } )

}
