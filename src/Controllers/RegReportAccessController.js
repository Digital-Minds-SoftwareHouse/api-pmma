const postgres = require('../../dbConfig')
const io = require('../../index')

io.on('connection', (socket) =>{
    console.log('Cliente Conectado! ID: ', socket.id);
})

exports.getPermission = async function (req, res, error){
    const response = await postgres.query('SELECT * FROM report_permissions')
    res.status(200).send(response.rows)
}
exports.getBattalionRequests = async function (req, res, error){
    const battalion = req.params.battalion
    let query = `SELECT * FROM report_permissions WHERE battalion = '${battalion}' AND request_closed = false`
    const response = await postgres.query(query)
    console.log(response.rows);
    res.status(200).send(response.rows)
}
exports.getOfficersRequests = async function (req, res, error){
    const userId = req.params.userId
    let query = `SELECT * FROM report_permissions WHERE id_policial = ${userId} AND request_closed = false AND permission = false`
    const response = await postgres.query(query)
    console.log();
    res.status(200).send(response.rows)
}
exports.postPermission = async function(req, res, error){
    const permissionValues = [
        battalion = req.body.battalion, 
        permission = req.body.permission, 
        date_request = req.body.date_request, 
        request_closed = req.body.request_closed, 
        id_policial = req.body.id_policial, 
        war_name = req.body.war_name, 
        graduation_rank = req.body.graduation_rank
    ]
    const queryPermissio = `
        INSERT INTO
            report_permissions(
                battalion, permission, date_request, request_closed, id_policial, war_name, graduation_rank
            )VALUES(
                $1, $2, $3, $4, $5, $6, $7
            )
    `
    try {
        await postgres.query(queryPermissio, permissionValues)
        io.emit(req.body.battalion, {permission: "requested"},  ()=>console.log('permissão solicitada'))
        console.log({message: 'permissão solicitada'});
        res.status(201).send({message: 'permissão solicitada'})
    } catch (error) {
        console.log(error);
    }
    
}
exports.patchPermission = async function (req, res, error){

    console.log({
        id : req.body?.id,
        permission : req.body?.permission,
        request_closed : req.body?.request_closed  ,
        id_policial: req.body?.userId      
    });
    const valuePermission = [
        id = req.body?.id,
        permission = req.body?.permission,
        request_closed = req.body?.request_closed
    ]
    const queryPermission = `
        UPDATE report_permissions
        SET permission = $2, request_closed = $3
        WHERE id = $1
    `
    try {
        await postgres.query(queryPermission, valuePermission)
      
            if(req.body?.permission == true && req.body?.request_closed == false){
                io.emit(req.body?.battalion, {permission: "granted", userId: req.body.userId}, ()=>console.log('deu Certo'))
                return res.status(200).send({"message" : 'Permissão Concedida!'})
            } 
            if(req.body?.permission == false && req.body?.request_closed == true){
                io.emit(req.body?.battalion, {permission: "deined", userId: req.body.userId},  ()=>console.log('deu Errado'))
                return res.status(200).send({"message" : 'Permissão Negada!!!!'})
            }
            if(req.body?.permission == false && req.body?.request_closed == false){
                io.emit(req.body?.battalion, {permission: "closed", userId: req.body.userId},  ()=>console.log('deu Errado'))
                return res.status(200).send({"message" : 'Permissão Negada!'})
            }
        
    } catch (error) {
        console.log(error);
    }
}
exports.patchFinalyReport = async function (req, res, error){

    console.log({
        id : req.body?.id,
        permission : req.body?.permission,
        request_closed : req.body?.request_closed  ,
        id_policial: req.body?.userId      
    });
    const valuePermission = [
        id_policial = req.body?.userId,
        permission = req.body?.permission,
        request_closed = req.body?.request_closed
    ]
    const queryPermission = `
        UPDATE report_permissions
        SET permission = $2, request_closed = $3
        WHERE id_policial = $1
    `
    try {
        await postgres.query(queryPermission, valuePermission)
      
            if(req.body?.permission == true && req.body?.request_closed == false){
                io.emit(req.body?.battalion, {permission: "granted", userId: req.body.userId}, ()=>console.log('deu Certo'))
                return res.status(200).send({"message" : 'Permissão Concedida!'})
            } 
            if(req.body?.permission == false && req.body?.request_closed == true){
                io.emit(req.body?.battalion, {permission: "closed", userId: req.body.userId},  ()=>console.log('rop finalizado'))
                return res.status(200).send({"message" : 'Ocorrencia Finalizada!'})
            }
            if(req.body?.permission == false && req.body?.request_closed == false){
                io.emit(req.body?.battalion, {permission: "closed", userId: req.body.userId},  ()=>console.log('deu Errado'))
                return res.status(200).send({"message" : 'Permissão Negada!'})
            }
        
    } catch (error) {
        console.log(error);
    }
}
