const postgres = require('../../dbConfig')
require('dotenv-safe').config()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

exports.login = async function(req, res, err){
    const credentials = [
        id_policial = req.body.id_policial,
        senha = req.body.senha
    ]
    const querySelecionaPolicial = `SELECT id_policial FROM policiais WHERE id_policial = ${credentials[0]} `
    try {
       const responseId = await  postgres.query(querySelecionaPolicial)
        if(responseId.rowCount === 0){
            return res.status(500).send({status: 'error', message: 'CREDENCIAIS DE LOGIN INVÁLIDAS'})
        }if(responseId.rowCount === 1){
            const querySelecionaPolicialSenha = `SELECT senha FROM policiais WHERE id_policial = ${responseId.rows[0].id_policial}`
            const responseSenha = await postgres.query(querySelecionaPolicialSenha)
            bcrypt.compare(credentials[1], responseSenha.rows[0].senha, async function(err, ress){
                if(ress === true){
                    const querySelecionaPolicialSenha = `SELECT * FROM policiais WHERE id_policial = ${responseId.rows[0].id_policial}`
                    const responsePolicialInformações =  await postgres.query(querySelecionaPolicialSenha)
                    const token = jwt.sign(responsePolicialInformações.rows[0].id_policial, process.env.SECRET)
                    return res.status(200).send({status: 'sucsess', message: 'LOGIN EFETUADO COM SUCESSO!', token: token, 
                    athorizedOfficer :{
                        warName:responsePolicialInformações.rows[0].nome_de_guerra,
                        id: responsePolicialInformações.rows[0].id_policial,
                        posto_graduacao: responsePolicialInformações.rows[0].posto_graduacao,
                        avatar: responsePolicialInformações.rows[0].avatar_path,
                        battalion: responsePolicialInformações.rows[0].batalhao
                    }
                })                    
                }if(ress === false){
                    return res.status(500).send({status: 'error', message: 'CREDENCIAIS DE LOGIN INVÁLIDAS'})
                }
            })
        }
   } catch (error) {
        return res.status(500).send({status: 'error', message: 'ERRO AO EFETUAR LOGIN!'})
   }
}