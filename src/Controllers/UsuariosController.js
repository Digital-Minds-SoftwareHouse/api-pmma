const postgres = require('../../dbConfig')
const bcrypt = require('bcryptjs');
const fs = require('fs')

exports.getOfficers = async function (req, res){
    console.log('visualização de usuários');
    try {
        const ress = await postgres.query('SELECT * FROM policiais')
        return res.status(200).send(ress.rows)        
    } catch (error) {
        res.status(500).send({status: 'error', message: 'ERRO AO BUSCAR LISTA DE USUARIOS'})
    }
}
exports.getEspecificOfficer = async function(req, res){
    const officerId = req.params.id
    const queryEspecificOfficerConfirm = `SELECT id_policial FROM policiais WHERE id_policial = ${officerId}`
    const queryEspecificOfficer = `SELECT * FROM policiais WHERE id_policial = ${officerId}`

    try {
        const resposeSerach = await postgres.query(queryEspecificOfficerConfirm)
        if(resposeSerach.rowCount === 1){
            const response = await postgres.query(queryEspecificOfficer)
            res.status(200).send(response.rows)
        }if(resposeSerach.rowCount === 0){
            res.status(402).send({status: 'error', message: 'NENHUM USUÁRIO COM O ID INFORMADO FOI ENCONTRADO.'})
        }
    } catch (error) {
        res.status(500).send({status: 'ERRO AO PERQUISAR USUÁRIO ESPECÍFICO.'})
    }
}
exports.postOfficers = async function ( req, res, err){
    
    //await console.log('senha: ', req.body.senha);
    //res.status(200).send(req.body)
    /*
    console.log(req.file);
    const senhaIn = req.body.senha
    let salt = bcrypt.genSaltSync(8)
    let hash = bcrypt.hashSync(senhaIn, salt)
    
    const file = req.file
    console.log('File:', file.filename);

    

    const valuesPolicial = [
        nome_completo = req.body.nome_completo,
        senha = hash,
        id_policial = req.body.id_policial,
        matricula = req.body.matricula,
        nome_de_guerra = req.body.nome_de_guerra,
        logradouro = req.body.logradouro,
        numero_casa_apto = req.body.numero_casa_apto,
        complemento = req.body.complemento,
        bairro = req.body.bairro,
        cidade = req.body.cidade,
        estado = req.body.estado,
        cep = req.body.cep,
        rg= req.body.rg,
        data_expedicao= req.body.data_expedicao,
        org_emissor= req.body.org_emissor,
        cpf= req.body.cpf,
        numero_titulo= req.body.numero_titulo,
        zona= req.body.zona,
        secao= req.body.secao,
        rg_militar= req.body.rg_militar,
        numero_cnh= req.body. numero_cnh,
        validade_cnh= req.body.validade_cnh,
        escolaridade = req.body.escolaridade,
        estado_civil = req.body.estado_civil,
        tipo_sanguineo = req.body.tipo_sanguineo,
        data_incorporacao = req.body.data_incorporacao,
        data_utima_promocao = req.body.data_utima_promocao,
        numero_calca = req.body.numero_calca,
        numero_coturno = req.body.numero_coturno,
        suadeira = req.body.suadeira,
        gandola = req.body.gandola,
        gorro = req.body.grro,
        funcao = req.body.funcao,
        situacao_atual = req.body.situacao_atual,
        banco = req.body.banco,
        agencia = req.body.agencia,
        conta = req.body.conta,
        avatar_path = file.filename,
        email = req.body.email,
        numero_telefone = req.body.numero_telefone,
        posto_graduacao = req.body.posto_graduacao,
    ]  




    //await console.log(1212, JSON.parse(req.body.userData));

    */

    const senhaIn = JSON.parse(req.body.userData).senha
    let salt = bcrypt.genSaltSync(8)
    let hash = bcrypt.hashSync(senhaIn, salt)
    
    const file = req.file
    console.log('File:', file.filename);

    const valuesPolicial = [
        nome_completo = JSON.parse(req.body.userData).nome_completo,
        senha = hash,
        id_policial = JSON.parse(req.body.userData).id_policial,
        matricula = JSON.parse(req.body.userData).matricula,
        nome_de_guerra = JSON.parse(req.body.userData).nome_de_guerra,
        logradouro = JSON.parse(req.body.userData).logradouro,
        numero_casa_apto = JSON.parse(req.body.userData).numero_casa_apto,
        complemento = JSON.parse(req.body.userData).complemento,
        bairro = JSON.parse(req.body.userData).bairro,
        cidade = JSON.parse(req.body.userData).cidade,
        estado = JSON.parse(req.body.userData).estado,
        cep = JSON.parse(req.body.userData).cep,
        rg= JSON.parse(req.body.userData).rg,
        data_expedicao= JSON.parse(req.body.userData).data_expedicao,
        org_emissor= JSON.parse(req.body.userData).org_emissor,
        cpf= JSON.parse(req.body.userData).cpf,
        numero_titulo= JSON.parse(req.body.userData).numero_titulo,
        zona= JSON.parse(req.body.userData).zona,
        secao= JSON.parse(req.body.userData).secao,
        rg_militar= JSON.parse(req.body.userData).rg_militar,
        numero_cnh= JSON.parse(req.body.userData). numero_cnh,
        validade_cnh= JSON.parse(req.body.userData).validade_cnh,
        escolaridade = JSON.parse(req.body.userData).escolaridade,
        estado_civil = JSON.parse(req.body.userData).estado_civil,
        tipo_sanguineo = JSON.parse(req.body.userData).tipo_sanguineo,
        data_incorporacao = JSON.parse(req.body.userData).data_incorporacao,
        data_utima_promocao = JSON.parse(req.body.userData).data_utima_promocao,
        numero_calca = JSON.parse(req.body.userData).numero_calca,
        numero_coturno = JSON.parse(req.body.userData).numero_coturno,
        suadeira = JSON.parse(req.body.userData).suadeira,
        gandola = JSON.parse(req.body.userData).gandola,
        gorro = JSON.parse(req.body.userData).grro,
        funcao = JSON.parse(req.body.userData).funcao,
        situacao_atual = JSON.parse(req.body.userData).situacao_atual,
        banco = JSON.parse(req.body.userData).banco,
        agencia = JSON.parse(req.body.userData).agencia,
        conta = JSON.parse(req.body.userData).conta,
        avatar_path = file.filename,
        email = JSON.parse(req.body.userData).email,
        numero_telefone = JSON.parse(req.body.userData).numero_telefone,
        posto_graduacao = JSON.parse(req.body.userData).posto_graduacao,
        batalhao = JSON.parse(req.body.userData).batalhao
    ]   
   

    const queryPolicial = `
    INSERT INTO policiais (
        nome_completo, senha, id_policial, matricula, nome_de_guerra, logradouro, 
        numero_casa_apto, complemento, bairro, cidade, estado,  
        cep,  escolaridade,  estado_civil,  tipo_sanguineo,  
        data_incorporacao,  data_utima_promocao,  numero_calca,  
        numero_coturno,  suadeira,  gandola,  gorro,  funcao, 
        situacao_atual, rg, data_expedicao, org_emissor, cpf, numero_titulo, 
        zona, secao, rg_militar, numero_cnh, validade_cnh, banco, agencia, conta, avatar_path,
        email, numero_telefone, posto_graduacao, batalhao
        ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,
            $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29,
        $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41 $42
        )
    `
    try {
        const response = await postgres.query(queryPolicial, valuesPolicial)
        return res.status(201).send('policial cadastrado dom sucesso.')
    } catch (error) {
        console.log(error);
        return res.status(500).send('Erro: Tente Novamente')
    }

}
exports.deleteOfficer = async function(req, res, err){
    let user = req.body.id_policial
    const queryDeletePolicial = `DELETE FROM policiais WHERE id_policial = ${user}`
    const querySelecionaPolicial = `SELECT id_policial, avatar_path FROM policiais WHERE id_policial = ${user} `
    try {
        const sep = await postgres.query(querySelecionaPolicial)
        if (sep.rowCount != 0){
            console.log(sep.rows[0].avatar_path);
            sep.rows[0].avatar_path != null ? fs.unlinkSync(sep.rows[0].avatar_path)  : null
            const response = await postgres.query(queryDeletePolicial)
            return res.status(200).send({status: 'error', message: 'O REGISTRO FOI EXCLUÍDO COM SUCESSO.'})

        }else{
            return res.status(404).send({status: 'error', message: 'O REGISTRO INFORMADO NÃO EXISTE NA BASE DE DADOS.'})
        }
    } catch (error) {
        return res.status(500).send({status: 'error', message: 'ERRO AO BUSCAR REGISTRO INFORMADO.'})
    }
}
exports.pathOfficer = async function(req, res){

    const senhaIn = req.body.senha
    let salt = bcrypt.genSaltSync(8)
    let hash = bcrypt.hashSync(senhaIn, salt)
    
    const file = req.file

    const valuesPolicial = [
        nome_completo = req.body.nome_completo,
        senha = hash,
        id_policial = Number(req.params.id_policial),
        matricula = Number(req.body.matricula),
        nome_de_guerra = req.body.nome_de_guerra,
        logradouro = req.body.logradouro,
        numero_casa_apto = req.body.numero_casa_apto,
        complemento = req.body.complemento,
        bairro = req.body.bairro,
        cidade = req.body.cidade,
        estado = req.body.estado,
        cep = req.body.cep,
        rg= req.body.rg,
        data_expedicao= req.body.data_expedicao,
        org_emissor= req.body.org_emissor,
        cpf= req.body.cpf,
        numero_titulo= req.body.numero_titulo,
        zona= req.body.zona,
        secao= req.body.secao,
        rg_militar= req.body.rg_militar,
        numero_cnh= req.body. numero_cnh,
        validade_cnh= req.body.validade_cnh,
        escolaridade = req.body.escolaridade,
        estado_civil = req.body.estado_civil,
        tipo_sanguineo = req.body.tipo_sanguineo,
        data_incorporacao = req.body.data_incorporacao,
        data_utima_promocao = req.body.data_utima_promocao,
        numero_calca = req.body.numero_calca,
        numero_coturno = req.body.numero_coturno,
        suadeira = req.body.suadeira,
        gandola = req.body.gandola,
        gorro = req.body.grro,
        funcao = req.body.funcao,
        situacao_atual = req.body.situacao_atual,
        banco = req.body.banco,
        agencia = req.body.agencia,
        conta = req.body.conta,
        avatar_path=file.path,
        email = req.body.email,
        numero_telefone = req.body.numero_telefone
    ]  
    const queryUpdatePolicial = `
    UPDATE policiais
    SET nome_completo = $1, senha = $2, matricula = $4, nome_de_guerra = $5, logradouro = $6,
        numero_casa_apto = $7, complemento = $8, bairro = $9, cidade = $10, estado = $11,
        cep = $12, escolaridade = $13, estado_civil = $14, tipo_sanguineo = $15,
        data_incorporacao = $16, data_utima_promocao = $17, numero_calca = $18,
        numero_coturno = $19, suadeira = $20, gandola = $21, gorro = $22, funcao = $23,
        situacao_atual = $24, rg = $25, data_expedicao = $26, org_emissor = $27, cpf = $28,
        numero_titulo = $29, zona = $30, secao = $31, rg_militar = $32, numero_cnh = $33,
        validade_cnh = $34. banco=$35, agencia=$36, conta=$37, avatar_path=$38, email=$39, 
        numero_telefone=$40
    WHERE id_policial = $3;     
    `
    try {
        const response = await postgres.query(queryUpdatePolicial, valuesPolicial)
        res.status(201).send({status: 'ok', message: 'REGIASTRO MODIFICADO COM SUCESSO!'})
    } catch (error) {
        console.log(error);
        console.log('deu errado');
    }
}
