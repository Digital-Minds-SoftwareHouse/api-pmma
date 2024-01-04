const postgres = require('../../dbConfig')
const MailSender = require('../Services/MailSender')
const MailRecoveryModel = require('../Functions/RecoveryPassModel')
const bcrypt = require('bcryptjs');

//411983

exports.postRedefineSendId = async function(req, res, err){
    id_policial = req.body.id_policial
    const querySerachOfficer = `SELECT * FROM policiais WHERE id_policial = ${id_policial}`
    try {
        const response = await postgres.query(querySerachOfficer)
        if (response.rows[0].id_policial === id_policial){
            
            const min = 222222
            const max = 999999
            const resetCode = Math.floor(Math.random() * (max - min + 1) + min)
            
            const values = [id_policial = id_policial, code_redef = resetCode ]
            const querySetRedefCode = `INSERT INTO redefinir_senha( id_policial_redef, code_redef) values($1, $2)`

            const reciver =  'pajhano@gmail.com' //response.rows[0].email
            const subject = 'Email de Recuperação de senha SIS-ADMIN 26BPM'
            const content = resetCode
            
            MailSender(reciver, subject, content, MailRecoveryModel(content))
            
            const responsePostResetCode = postgres.query(querySetRedefCode, values)

            return res.status(202).send({error: false, message: id_policial, code: resetCode})        
        }else{
            return res.status(401).send({error: true, message: 'ERRO AO VERIFICAR ID DE USUARIO'})
        }
    } catch (error) {
        return res.status(500).send({error: true, message: 'ERRO INTERNO, FAVOR CONTACTAR A ADMINISTRAÇÃO DO SISTEMA.'})
    }
}
exports.postRedefineConfirmCode = async function (req, res, err){
    const code_redef = req.body.code_redef
    const queryCompareRedefCode = `SELECT * FROM redefinir_senha WHERE code_redef = ${code_redef}`

    try {
        const responseSearchCode = await postgres.query(queryCompareRedefCode)
        if(responseSearchCode.rowCount === 0){
            return res.status(404).send({error: true, message: 'codigo incorreto'})
        }
        if(responseSearchCode.rows[0].code_redef === code_redef){
            return res.send({error: false, content: responseSearchCode.rows[0]})
        }
    } catch (error) {
        res.status(500).send({error: true, message: 'CODIGO INCORRETO INFORMADO' })
    }

}
exports.postRedefinePass = async function (req, res, err){
    console.log("Redefinição");
    const id_policial = req?.body.id_policial
    const new_password = req?.body.new_password

    if(new_password === "" || new_password === undefined || new_password === null ){
        return res.status(500).send("Erro, nenhum dado recebido")
    }if(new_password != "" && new_password != undefined && new_password != null ){
        try {
            let salt = bcrypt.genSaltSync(8)
            let hash = bcrypt.hashSync(new_password, salt)
            
            console.log('Passou o salt');

            const query1 = `SELECT * FROM policiais WHERE id_policial = ${id_policial}`
            const queryUpdatePass = `UPDATE policiais SET senha = $1 WHERE id_policial = ${id_policial} `
        
            const response = (await postgres.query(queryUpdatePass, [hash]).then(console.log("Senha Modificada")))

            res.status(201).send({message: "Senha redefinida com sucesso"})
            
        } catch (error) {
            console.log(error);
            res.status(500).send({message: "Erro ao redefinir senha."})
            
        }

    }

}