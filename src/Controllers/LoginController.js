const postgres = require('../../dbConfig')
require('dotenv-safe').config()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

exports.login = async function(req, res, err){
    console.log("ROTA DE LOGIN");
    const credentials = [
        id_policial = req.body.id_policial,
        senha = req.body.senha
    ]
    const querySelecionaPolicial = `SELECT id_policial FROM policiais WHERE id_policial = ${credentials[0]} `
        const query = `
    SELECT r.id, r.number_report, r.date_time, r.report_city, r.police_garrison, ps.id_policial, string_agg(n.nature, ', ') AS naturezas
    FROM report r
    JOIN report_staff rs ON r.number_report = rs.number_report
    JOIN police_staff ps ON rs.staff_id = ps.id
    JOIN report_nature rn ON r.number_report = rn.number_report
    JOIN natures n ON rn.nature_id = n.id
    WHERE ps.id_policial = ${credentials[0]}
    GROUP BY r.id, r.number_report, r.date_time, r.report_city, r.police_garrison, ps.id_policial;
    `
    try {
        const response = await postgres.query(query)
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
                    console.log('Logado')
                    return res.status(200).send({status: 'sucsess', message: 'LOGIN EFETUADO COM SUCESSO!', token: token,                     
                    athorizedOfficer :{
                        warName:responsePolicialInformações.rows[0].nome_de_guerra,
                        id: responsePolicialInformações.rows[0].id_policial,
                        posto_graduacao: responsePolicialInformações.rows[0].posto_graduacao,
                        avatar: responsePolicialInformações.rows[0].avatar_path,
                        battalion: responsePolicialInformações.rows[0].batalhao,
                        function: responsePolicialInformações.rows[0].funcao ,
                        incidentsAttended: response.rowCount,
                        generalScore: 100,
                        availableScore: 100
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