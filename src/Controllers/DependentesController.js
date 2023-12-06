const postgres = require('../../dbConfig')

exports.getDependents = async function (req, res, err){
    const queryGetDependents = 'SELECT * FROM dependentes'
    const response =  await postgres.query(queryGetDependents)
    res.send(response.rows)
}
exports.getDependentsPerOfficer = async function (req, res, err){
    const id_policial = req.params.id_policial

    const queryGetDeppendentsPerOfficer = `SELECT * FROM dependentes WHERE id_policial = ${id_policial}`
    try {
        const response = await postgres.query(queryGetDeppendentsPerOfficer)
        if(response.rowCount > 0){res.send(response.rows)}
        if(response.rowCount === 0){res.status(404).send({status:'error', message:'NENHUM DEPENDENTE REGISTRADO PARA O POLICIAL SELECIONADO'})}
    } catch (error) {
        res.status(500).send({status:'error', message:'ERRO AO BUSCAR DEPENDENTE POR POLICIAL'})
    }
}
exports.getIndividualDependent = async function (req, res, err){
    const dependentId = req.params.id
    const queryGetIndividualDependent = `SELECT * FROM dependentes WHERE id = ${dependentId}`
    try {
        const response = await postgres.query(queryGetIndividualDependent)
        if(response.rowCount === 1 ){res.status(201).send(response.rows[0])}
        if(response.rowCount === 0 ){res.status(404).send({status:'error', message:'DEPENDENTE NÃO ENCONTRADO'})}        
    } catch (error) {
        res.status(500).send({status:'error', message:'ERRO AO BUSCAR DEPENDENTE INDIVIDUAL'})
    }
}
exports.postDependents = async function ( req, res, err){
    const dependentsValues = [
        id_policial= req.body.id_policial ,
        nome = req.body.nome ,
        nome_social = req.body.nome_social ,
        data_nascimento = req.body.data_nascimento ,
        endereço = req.body.endereço ,
        rg = req.body.rg ,
        cpf = req.body.cpf ,
        sexo = req.body.sexo ,
        parentesco = req.body.parentesco
    ]
    const queryPostDependents = `INSERT INTO 
        dependentes(
            id_policial, nome, nome_social, data_nascimento, endereço, rg, 
            cpf, sexo, parentesco
        )VALUES(
            $1, $2, $3, $4, $5, $6, $7, $8, $9
        )
        `
    try {
        const response = await postgres.query(queryPostDependents, dependentsValues)
        res.status(201).send({status:'success'})
    } catch (error) {
        res.status(500).send({status: 'error', message: 'ERRO AO CADASTRAR DEPENDENTE.'})
    }
}
exports.putDependents = async function ( req, res, err){
    const dependentId = req.params.id
    const dependentsValues = [
        id_policial= req.body.id_policial ,
        nome = req.body.nome ,
        nome_social = req.body.nome_social ,
        data_nascimento = req.body.data_nascimento ,
        endereço = req.body.endereço ,
        rg = req.body.rg ,
        cpf = req.body.cpf ,
        sexo = req.body.sexo ,
        parentesco = req.body.parentesco
    ]
    const  queryPutDependentes = `
        UPDATE dependentes
        SET id_policial=$1, nome=$2, nome_social=$3, data_nascimento=$4,
        endereço=$5, rg=$6, cpf=$7, sexo=$8, parentesco=$9
        WHERE id = ${dependentId}
    `
    try {
        const response = postgres.query(queryPutDependentes, dependentsValues)
        res.status(200).send({status: 'success', message: 'DEPENDENTE ALTERADO COM SUCESSO!'})
    } catch (error) {
        res.status(500).send({status: 'error', message: 'ERRO AO ALTERAR CADASTRO DE DEPENDENTES!'})
    }
}


