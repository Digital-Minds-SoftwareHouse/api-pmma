const bcrypt = require('bcryptjs');
const fs = require('fs')
const SeedUsers = require('../../aaaaaaa')
const postgres = require('../../dbConfig')



exports.GettAllUpm = async function (req, res, err){
    const response = (await postgres.query('SELECT * from upm')).rows
    res.send(response)
}
exports.getSpecifcUpm = async function(req, res, err){
    const upm_name = req.body.upm_name
    const response = (await postgres.query(`SELECT * FROM upm WHERE upm_name = '${upm_name}' `)).rows
    res.status(202).send(response)
}
exports.postUpm = async function (req, res, err){
    const values = [
        upm_name = req.body.upm_name,
        upm_phone = req.body.upm_phone,
        upm_email = req.body.upm_email,
        upm_address = req.body.upm_address,
        upm_citie = req.body.upm_citie,
        upm_coat_of_arms_path = req.body.upm_coat_of_arms_path
    ]
    const query = `
        INSERT INTO upm(upm_name, upm_phone, upm_email, upm_address, upm_citie, upm_coat_of_arms_path )
        VALUES($1, $2, $3, $4, $5, $6)
    `
    try {
        await postgres.query(query,values)
        res.status(201).send({message: "success"})
       
    } catch (error) {
        res.status(500).send(error)
    }
}
exports.UpdateUpm = async function (req, res, err) {
    const values = [
        upm_name = req.body.upm_name,
        upm_phone = req.body.upm_phone,
        upm_email = req.body.upm_email,
        upm_address = req.body.upm_address,
        upm_citie = req.body.upm_citie,
        upm_coat_of_arms_path = req.body.upm_coat_of_arms_path
    ]
    const query = `
        UPDATE upm 
        SET upm_phone = $2, upm_email = $3, upm_address = $4, 
            upm_citie = $5, upm_coat_of_arms_path = $6
        WHERE upm_name = $1
    ` 
    try {
        await postgres.query(query, values)
        res.status(202).send({message: "success"})
    } catch (error) {
        res.status(500).send({message: error})        
    }
}
exports.deleteUpm = async function (req, res, err){
    const upm_name = req.body.upm_name

    const query = `
        DELETE FROM upm WHERE upm_name = '${upm_name}'  
    `
    
    try {
        await postgres.query(query)
        res.sytatus(202).send({message: "success"})        
    } catch (error) {
        res.status(500).send(error)
    }
}
exports.getAllCities = async function (req, res, err){
    res.send('rota das cidades do cpai3')
}
exports.getAllNeighborhoods = async function (req, res, err){
    res.send('bairros por cidade do cpai3')
}
exports.seedUsers = async function(req, res, err){

    async function salvarNoBancoDeDados(pessoa) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {

                const senhaIn = pessoa?.cpf
                let salt = bcrypt.genSaltSync(8)
                let hash = bcrypt.hashSync(senhaIn, salt)

                function devolveNull(val){
                    if(val === " "){
                        return null
                    }
                }
                function retornaZero(val){
                    if(val === null || val === undefined || val === ""){
                        return pessoa?.id_policial
                    }
                }
                console.log(pessoa?.data_expedicao);
                const valuesPolicial = [
                    nome_completo = pessoa?.nome_completo,
                    senha = hash,
                    id_policial = pessoa?.id_policial,
                    matricula = retornaZero(pessoa?.matricula),
                    nome_de_guerra = pessoa?.nome_de_guerra,
                    logradouro = pessoa?.endereco,
                    numero_casa_apto = pessoa?.numero_casa_apto,
                    complemento = pessoa?.complemento,
                    bairro = pessoa?.bairro,
                    cidade = pessoa?.cidade,
                    estado = pessoa?.estado,
                    cep = pessoa?.cep,
                    rg= pessoa?.rg,
                    org_emissor= pessoa?.org_emissor,
                    cpf= pessoa?.cpf,
                    numero_titulo= pessoa?.numero_titulo,
                    zona= pessoa?.zona,
                    secao= pessoa?.secao,
                    rg_militar= pessoa?.rg_militar,
                    numero_cnh= pessoa?. numero_cnh,
                    escolaridade = pessoa?.escolaridade,
                    estado_civil = pessoa?.estado_civil,
                    tipo_sanguineo = pessoa?.tipo_sanguineo,
                    numero_calca = pessoa?.numero_calca,
                    numero_coturno = pessoa?.numero_coturno,
                    suadeira = pessoa?.suadeira,
                    gandola = pessoa?.gandola,
                    gorro = pessoa?.gorro,
                    funcao = pessoa?.funcao,
                    situacao_atual = pessoa?.situacao_atual,
                    banco = pessoa?.banco,
                    agencia = pessoa?.agencia,
                    conta = pessoa?.conta,
                    email = pessoa?.email,
                    numero_telefone = pessoa?.telefone,
                    posto_graduacao = pessoa?.posto_graduacao,
                    batalhao = '26 BPM'
                ]
                const queryPolicial = `
                INSERT INTO policiais (
                    nome_completo, senha, id_policial, matricula, nome_de_guerra, logradouro, 
                    numero_casa_apto, complemento, bairro, cidade, estado,  
                    cep, rg, org_emissor, cpf, numero_titulo, 
                    zona, secao, rg_militar, numero_cnh, escolaridade,  estado_civil,  tipo_sanguineo, numero_calca,  
                    numero_coturno,  suadeira,  gandola,  gorro,  funcao, 
                    situacao_atual,  banco, agencia, conta, 
                    email, numero_telefone, posto_graduacao, batalhao
                    ) VALUES (
                        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,
                        $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29,
                    $30, $31, $32, $33, $34, $35, $36, $37
                    )
                `
                
                    const response = postgres.query(queryPolicial, valuesPolicial)
                    console.log(`policial ${pessoa?.posto_graduacao} ${pessoa?.nome_de_guerra} cadastrado dom sucesso.`)               
               
                resolve({ message: "Registrado!" });
            }, 1000);
        });
    }
    for(let i = 0; i < SeedUsers?.length; i++){
        await salvarNoBancoDeDados(SeedUsers[i])
        
    }
    
    
    res.status(200).send({message: `Registros Concluidos`})






}