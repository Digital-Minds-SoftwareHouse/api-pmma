const postgres = require('../../dbConfig')
const deleteRelationship = require('../Functions/deleteRelationship')

exports.getAllReports = async function (req, res, err){

    console.log('ROTA DE OCORRENCIAS');
    const reports = (await postgres.query(` SELECT * FROM report`)).rows

    const reports_envolveds = (await postgres.query('SELECT * FROM report_envolved')).rows
    const envolveds = (await postgres.query('SELECT * FROM envolved')).rows

    const reports_natures = (await postgres.query('SELECT * FROM report_nature')).rows
    const natures = (await postgres.query('SELECT * FROM natures')).rows

    const reports_objects = (await postgres.query('SELECT * FROM report_objects')).rows
    const objects = (await postgres.query('SELECT * FROM objects')).rows

    const reports_staff = (await postgres.query('SELECT * FROM report_staff')).rows
    const staff = (await postgres.query('SELECT * FROM police_staff')).rows

    const response_array = []

    for(let i = 0; i < reports.length; i++){
        let envolved_array = []
        let nature_array = []
        let objects_array = []
        let staff_array = []
 
        for(let j = 0; j < reports_envolveds.length; j++){
            if (reports[i].number_report === reports_envolveds[j].number_report){
                envolved_array.push(envolveds[j])
            }          
        }
        for(let k = 0; k < reports_natures.length; k++ ){
            if(reports[i].number_report === reports_natures[k].number_report){
                nature_array.push(natures[k])
            }
        }
        for(let l = 0; l < reports_objects.length; l++){
            if(reports[i].number_report === reports_objects[l].number_report){
                objects_array.push(objects[l])
            }
        }
        for(let m = 0; m < reports_staff.length; m++){
            if(reports[i].number_report === reports_staff[m].number_report){
                staff_array.push(staff[m])
            }
        }
        response_array.push(
            { 
                number_report: reports[i].number_report,
                type_report: reports[i].type_report,
                date_time: reports[i].date_time,
                report_address: reports[i].report_address,
                report_district: reports[i].report_district,
                report_city: reports[i].report_city,
                cep: reports[i].cep,
                police_garrison: reports[i].police_garrisson,
                latitude: reports[i].latitude,
                longitude: reports[i].longitude,
                history: reports[i].history,
                area: reports[i].area,
                battalion: reports[i].battalion,
                punctuaction: reports[i].punctuaction,
                natures: nature_array.map(item=>item),
                envolveds: envolved_array.map(item=>item),
                objects: objects_array.map(item=>item),
                police_staff: staff_array.map(item=>item),
                use_handcuffs : reports[i].use_handcuffs,
                justify_handcuffs : reports[i].justify_handcuffs,
                comments : reports[i].comments,
                upm_contact : reports[i].upm_contact,
                motivation_approach : reports[i].motivation_approach,
                origin : reports[i].origin
            }
        )        
    }
    res.status(302).send(response_array)
}
exports.getSpecificReport = async function (req, res, err){
    let battalionParam = new String(req.params.battalion)
    let reportNumberParam = req.params.number_report

    console.log('ROTA DE OCORRENCIAS');
    const reports = (await postgres.query(` SELECT * FROM report WHERE  number_report = '${reportNumberParam}'`)).rows
    if(reports.length == 0) {
        return res.status(404).send({message: "ROP não encontrado ou não registrado"})
    }else if (reports.length != 0){
        const envolveds = (await postgres.query(`
            SELECT 
                envolved.id,
                envolved.name,
                envolved.type_of_involvement,
                envolved.birthdate,
                envolved.mother,
                envolved.sex,
                envolved.gender,
                envolved.address,
                envolved.city,
                envolved.district,
                envolved.naturalness,
                envolved.race_color,
                envolved.phone_number,
                envolved.rg,
                envolved.cpf,
                envolved.particular_signs,
                envolved.bodily_injuries,
                envolved.profession 
            FROM envolved
            LEFT join report_envolved ON report_envolved.envolved_id = envolved.id
            WHERE report_envolved.number_report = '${reportNumberParam}'    
        `)).rows
        const objects = (await postgres.query(`
            SELECT 
                objects.id,
                objects.type,
                objects.subtype,
                objects.description,
                objects.quantity,
                objects.serial_number,
                objects.chassis,
                objects.brand,
                objects.model,
                objects.plate,
                objects.color,
                objects.stolen_recovered,
                objects.caliber
            FROM objects
            LEFT JOIN report_objects ON report_objects.object_id = objects.id
            WHERE report_objects.number_report = '${reportNumberParam}'
        
        `)).rows
        const natures = (await postgres.query(`
            SELECT 
                natures.id,
                natures.nature,
                natures.punctuaction
            FROM natures
            LEFT JOIN report_nature ON report_nature.nature_id = natures.id
            WHERE report_nature.number_report = '${reportNumberParam}'    
        `)).rows
        const police_staff = (await postgres.query(`
            SELECT 
                police_staff.id,
                police_staff.war_name,
                police_staff.graduation_rank,
                police_staff.id_policial,
                police_staff.staff_function
            FROM police_staff
            LEFT JOIN report_staff ON report_staff.staff_id = police_staff.id
            WHERE report_staff.number_report = '${reportNumberParam}'
        `)).rows
        const response ={ 
            number_report: reports[0]?.number_report,
            type_report: reports[0]?.type_report,
            date_time: reports[0]?.date_time,
            report_address: reports[0]?.report_address,
            report_district: reports[0]?.report_district,
            report_city: reports[0]?.report_city,
            cep: reports[0]?.cep,
            police_garrison: reports[0]?.police_garrisson,
            latitude: reports[0]?.latitude,
            longitude: reports[0]?.longitude,
            history: reports[0]?.history,
            area: reports[0]?.area,
            battalion: reports[0]?.battalion,
            punctuaction: reports[0]?.punctuaction,
            use_handcuffs : reports[0]?.use_handcuffs,
            justify_handcuffs : reports[0]?.justify_handcuffs,
            comments : reports[0]?.comments,
            upm_contact : reports[0]?.upm_contact,
            motivation_approach : reports[0]?.motivation_approach,
            origin : reports[0]?.origin,
            natures: natures,
            envolveds: envolveds,
            objects: objects,
            police_staff: police_staff,
        }
        res.status(302).send(response) 
    }
}
exports.postReport = async function (req, res, err){
    console.log('rota de post')
    console.log(req.body);
    let majorPoints = 0
    let date_ok = ''
    const number_last_report_query = 'SELECT number_report FROM report ORDER BY id DESC LIMIT 1'
    const year_last_report_query = 'SELECT date_time FROM report ORDER BY id DESC LIMIT 1'
    let number_last_report =  (await postgres.query(number_last_report_query)).rows[0] === undefined ? 0 : 
                                (await postgres.query(number_last_report_query)).rows[0].number_report
    const year_last_report = 
        (await postgres.query(year_last_report_query)).rows[0] === undefined ?
        new Date().getFullYear():
        new Date((await postgres.query(year_last_report_query)).rows[0].date_time).getFullYear()

    function set_report_number_by_year (){
        const actual_year = new Date().getFullYear()
        //const regex = /(\d{1,2}|20[2-9][3-9])|2023/g
        const regex = /(.*?)(?:[1-9]\d)(?:[A-Z])(?:[A-Z])(?:[A-Z])(?:202[3-9]|20[3-9]\d)$/

        if(year_last_report === actual_year){
            let s = String(number_last_report).replace(regex, "$1")
            console.log('console do S: ', s)
            number_last_report = `${Number(s) + 1}${req.body.battalion.replace(" ", "")}${actual_year}`
            return number_last_report
        }
        else if(year_last_report < actual_year){
            let d = 1   
            number_last_report = `${d}${req.body.battalion}${actual_year}`      
            return number_last_report
        }
    }

    for(let i = 0; i < req.body.natures.length; i++){
        if(req.body.natures[i].punctuaction > majorPoints){
            majorPoints = req.body.natures[i].punctuaction
        }
    }
    date_ok = new Date().toISOString()
    const generalInformationValue =[
        number_report = set_report_number_by_year(),
        type_report = req.body.type_report,
        date_time = req.body.date_time,
        report_address = req.body.report_address,
        report_city = req.body.report_city,
        report_district = req.body.report_district,
        cep = req.body.cep,
        police_garrison = req.body.police_garrison,
        latitude = req.body.latitude,
        longitude = req.body.longitude,
        history = req.body.history,
        area = req.body.area,
        battalion = req.body.battalion,
        punctuaction = majorPoints,
        use_handcuffs = req.body.use_handcuffs,
        justify_handcuffs = req.body.justify_handcuffs,
        comments = req.body.comments,
        upm_contact = req.body.upm_contact,
        motivation_approach = req.body.motivation_approach,
        origin = req.body.origin
    ]
    const general_information_query = `INSERT INTO report (number_report, type_report, date_time, report_address,
                                       report_city, report_district, cep, police_garrison,latitude, longitude,
                                       history, area, battalion, punctuaction, use_handcuffs, justify_handcuffs, 
                                       comments, upm_contact, motivation_approach, origin )
                                       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,
                                        $16, $17, $18, $19, $20)
                                       `
    async function nature_register (){        
        for(let i = 0; i < req.body.natures.length; i++){
            const natures_values = [
                nature = req.body.natures[i].nature,
                punctuaction = req.body.natures[i].punctuaction
            ]
            const nature_query = `INSERT INTO natures(nature, punctuaction) VALUES($1, $2)`
            await postgres.query(nature_query, natures_values)

            const id_nature = await postgres.query("SELECT id FROM natures ORDER BY id DESC LIMIT 1")
            const relationship_values = [
                number_report = number_last_report,
                nature_id = id_nature.rows[0].id
            ]
            const relationship_query = `INSERT INTO report_nature(number_report, nature_id) VALUES($1, $2)`
            await postgres.query(relationship_query, relationship_values)
        }
    }
    async function envolveds_register (){
        for(let i = 0; i < req.body.envolveds.length; i++){
            const envolveds_values = [
                name = req.body.envolveds[i].name,
                type_of_involvement = req.body.envolveds[i].type_of_envolvement,
                birthdate = req.body.envolveds[i].birthdate,
                mother = req.body.envolveds[i].mother,
                sex = req.body.envolveds[i].sex,
                gender = req.body.envolveds[i].gender,
                address = req.body.envolveds[i].address,
                district = req.body.envolveds[i].district,
                city = req.body.envolveds[i].city,
                naturalness = req.body.envolveds[i].naturalness,
                race_color = req.body.envolveds[i].race_color,
                phone_number = req.body.envolveds[i].phone_number,
                rg = req.body.envolveds[i].rg,
                cpf = req.body.envolveds[i].cpf,
                profession = req.body.envolveds[i].profession,
                particular_signs = req.body.envolveds[i].particular_signs,
                bodily_injuries = req.body.envolveds[i].bodily_injuries
            ]
            const envolved_query = `
                INSERT INTO envolved(  name, type_of_involvement, birthdate, mother, sex, gender,
                                        address, district, city, naturalness, race_color, 
                                        phone_number, rg, cpf, profession, particular_signs, bodily_injuries )
                VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
            `
            await postgres.query(envolved_query, envolveds_values)

            const id_envolved = await postgres.query("SELECT id FROM envolved ORDER BY id DESC LIMIT 1")
            const relationship_values = [
                number_report = number_last_report,
                envolved_id = id_envolved.rows[0].id
            ]
            const relationship_query = `
                INSERT INTO report_envolved(number_report, envolved_id) VALUES($1, $2)
            `
            await postgres.query(relationship_query, relationship_values)
        }
    }
    async function objects_register (){
        for( let i = 0; i < req.body.objects.length; i++){
            const objects_values = [
                type = req.body.objects[i].type ,
                subtype = req.body.objects[i].subtype,
                description = req.body.objects[i].description,
                quantity = req.body.objects[i].quantity,
                serial_number = req.body.objects[i].serial_number,
                chassis = req.body.objects[i].chassis,
                brand = req.body.objects[i].brand,
                model = req.body.objects[i].model,
                plate = req.body.objects[i].plate,
                color = req.body.objects[i].color,
                stolen_recovered = req.body.objects[i].stolen_recovered,
                caliber = req.body.objects[i].caliber
            ]
            const objects_query = `
                INSERT INTO objects(type, subtype, description, quantity, serial_number,
                                    chassis, brand, model, plate, color, stolen_recovered, caliber)
                VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            `
            await postgres.query(objects_query, objects_values)

            const id_object = await postgres.query(`SELECT id FROM objects ORDER BY id DESC LIMIT 1`)
            const relationship_values = [
                number_report = number_last_report,
                object_id = id_object.rows[0].id
            ]
            const relationship_query = `
                INSERT INTO report_objects(number_report, object_id) VALUES($1, $2)
            `
            await postgres.query(relationship_query, relationship_values)
        }
    }
    async function staff_register(){
        for(let i = 0; i < req.body.police_staff.length; i++){
            const staff_values = [
                graduation_rank = req.body.police_staff[i].graduation_rank,
                war_name = req.body.police_staff[i].war_name,
                id_policial = req.body.police_staff[i].id_policial,
                staff_function = req.body.police_staff[i].staff_function
            ]
            const staff_query = `
                INSERT INTO police_staff(graduation_rank, war_name, id_policial, staff_function)
                VALUES($1, $2, $3, $4)
            `
            await postgres.query(staff_query, staff_values)

            const id_staff = await postgres.query(`SELECT id FROM police_staff ORDER BY id DESC LIMIT 1`)
            const relationship_values = [
                number_report = number_last_report,
                staff_id = id_staff.rows[0].id
            ]
            const relationship_query = `
                INSERT INTO report_staff(number_report, staff_id) VALUES($1, $2)
            `
            await postgres.query(relationship_query, relationship_values)
        }
    }
    try {
        await postgres.query(general_information_query, generalInformationValue)
        nature_register()
        envolveds_register()
        objects_register()
        staff_register()
        res.status(201).send({message: 'report register success!'})        
    } 
    catch (error) {
        console.log(error);
        res.status(500).send({message: "internal error!"})
    }
}
exports.deleteReport = async function(req, res, err){
    try {
    const number_report = req.body.number_report
    const nature_key = (await postgres.query(`SELECT * FROM report_nature WHERE number_report = '${number_report}'`)).rows
    const envolved_key = (await postgres.query(`SELECT * FROM report_envolved WHERE number_report = '${number_report}'`)).rows
    const object_key = (await postgres.query(`SELECT * FROM report_objects WHERE number_report = '${number_report}'`)).rows
    const staff_key = (await postgres.query(`SELECT * FROM report_staff WHERE number_report = '${number_report}'`)).rows

    for(let i = 0; i < nature_key.length; i++){
        postgres.query(`DELETE FROM natures WHERE id = ${nature_key[i].nature_id}`)
    }
    for(let j = 0; j < envolved_key.length; j++){
        postgres.query(`DELETE FROM envolved WHERE id = ${envolved_key[j].envolved_id}`)
    }
    for(let k = 0; k < object_key.length; k++){
        postgres.query(`DELETE FROM objects WHERE id = ${object_key[k].object_id}`)
    }
    for(let l = 0; l < staff_key.length; l++){
        postgres.query(`DELETE FROM police_staff WHERE id = ${staff_key[l].staff_id}`)
    }
    postgres.query(`DELETE FROM report WHERE number_report = ${number_report}`)
        res.status(201).send({message: "Deleting report success!", id: number_report})
    } catch (error) {
        res.status(500).send({message: "Error deleting report!"})
    }
}
exports.putReport = async function (req, res, err){
    console.log('PUT REPORTS');
    //console.log(req.body);
    let number_report = req.body.number_report

    async function deleteRegisters(){
        const nature_key = (await postgres.query(`SELECT * FROM report_nature WHERE number_report = '${number_report}'`)).rows
        const envolved_key = (await postgres.query(`SELECT * FROM report_envolved WHERE number_report = '${number_report}'`)).rows
        const object_key = (await postgres.query(`SELECT * FROM report_objects WHERE number_report = '${number_report}'`)).rows
        const staff_key = (await postgres.query(`SELECT * FROM report_staff WHERE number_report = '${number_report}'`)).rows
        console.log(nature_key);
        
        for(let i = 0; i < nature_key.length; i++){
            postgres.query(`DELETE FROM natures WHERE id = ${nature_key[i].nature_id}`).then(console.log("natureza deletada"))
        }
        for(let j = 0; j < envolved_key.length; j++){
            postgres.query(`DELETE FROM envolved WHERE id = ${envolved_key[j].envolved_id}`)
        }
        for(let k = 0; k < object_key.length; k++){
            postgres.query(`DELETE FROM objects WHERE id = ${object_key[k].object_id}`)
        }
        for(let l = 0; l < staff_key.length; l++){
            postgres.query(`DELETE FROM police_staff WHERE id = ${staff_key[l].staff_id}`)
        }  
    }
    async function nature_register (){        
        for(let i = 0; i < req.body.natures.length; i++){
            const natures_values = [
                nature = req.body.natures[i].nature,
                punctuaction = req.body.natures[i].punctuaction
            ]
            const nature_query = `INSERT INTO natures(nature, punctuaction) VALUES($1, $2)`
            await postgres.query(nature_query, natures_values).then(console.log('inserido natureza '))

            const id_nature = await postgres.query("SELECT id FROM natures ORDER BY id DESC LIMIT 1")
            const relationship_values = [
                number_report =  req.body.number_report,
                nature_id = id_nature.rows[0].id
            ]
            const relationship_query = `INSERT INTO report_nature(number_report, nature_id) VALUES($1, $2)`
            
            await postgres.query(relationship_query, relationship_values).then(console.log("inserido ralacionamento NATUREZA"))
        }
    }
    async function envolveds_register (){
        for(let i = 0; i < req.body.envolveds.length; i++){
            const envolveds_values = [
                name = req.body.envolveds[i].name,
                type_of_involvement = req.body.envolveds[i].type_of_envolvement,
                birthdate = req.body.envolveds[i].birthdate,
                mother = req.body.envolveds[i].mother,
                sex = req.body.envolveds[i].sex,
                gender = req.body.envolveds[i].gender,
                address = req.body.envolveds[i].address,
                district = req.body.envolveds[i].district,
                city = req.body.envolveds[i].city,
                naturalness = req.body.envolveds[i].naturalness,
                race_color = req.body.envolveds[i].race_color,
                phone_number = req.body.envolveds[i].phone_number,
                rg = req.body.envolveds[i].rg,
                cpf = req.body.envolveds[i].cpf,
                profession = req.body.envolveds[i].profession,
                particular_signs = req.body.envolveds[i].particular_signs,
                bodily_injuries = req.body.envolveds[i].bodily_injuries,

            ]
            const envolved_query = `
                INSERT INTO envolved(  name, type_of_involvement, birthdate, mother, sex, gender,
                                        address, district, city, naturalness, race_color, 
                                        phone_number, rg, cpf, profession, particular_signs, bodily_injuries )
                VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
            `
            await postgres.query(envolved_query, envolveds_values)
            console.log('inserindo envolvido')

            const id_envolved = await postgres.query("SELECT id FROM envolved ORDER BY id DESC LIMIT 1")
            const relationship_values = [
                number_report =  req.body.number_report,
                envolved_id = id_envolved.rows[0].id
            ]
            const relationship_query = `
                INSERT INTO report_envolved(number_report, envolved_id) VALUES($1, $2)
            `
            await postgres.query(relationship_query, relationship_values) 
            console.log('inserindo envolvido RELACIONAMENTO')
        }
    }
    async function objects_register (){
        for( let i = 0; i < req.body.objects.length; i++){
            const objects_values = [
                type = req.body.objects[i].type ,
                subtype = req.body.objects[i].subtype,
                description = req.body.objects[i].description,
                quantity = req.body.objects[i].quantity,
                serial_number = req.body.objects[i].serial_number,
                chassis = req.body.objects[i].chassis,
                brand = req.body.objects[i].brand,
                model = req.body.objects[i].model,
                plate = req.body.objects[i].plate,
                color = req.body.objects[i].color,
                stolen_recovered = req.body.objects[i].stolen_recovered,
                caliber = req.body.objects[i].caliber
            ]
            const objects_query = `
                INSERT INTO objects(type, subtype, description, quantity, serial_number,
                                    chassis, brand, model, plate, color, stolen_recovered, caliber)
                VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            `
            await postgres.query(objects_query, objects_values)
            console.log('inserindo OBJETO ')

            const id_object = await postgres.query(`SELECT id FROM objects ORDER BY id DESC LIMIT 1`)
            const relationship_values = [
                number_report =  req.body.number_report,
                object_id = id_object.rows[0].id
            ]
            const relationship_query = `
                INSERT INTO report_objects(number_report, object_id) VALUES($1, $2)
            `
            await postgres.query(relationship_query, relationship_values)
            console.log('inserindo OBJETO RELACIONAMENTO')
        }
    }
    async function staff_register(){
        for(let i = 0; i < req.body.police_staff.length; i++){
            const staff_values = [
                graduation_rank = req.body.police_staff[i].graduation_rank,
                war_name = req.body.police_staff[i].war_name,
                id_policial = req.body.police_staff[i].id_policial,
                staff_function = req.body.police_staff[i].staff_function
            ]
            const staff_query = `
                INSERT INTO police_staff(graduation_rank, war_name, id_policial, staff_function)
                VALUES($1, $2, $3, $4)
            `
            await postgres.query(staff_query, staff_values)
            console.log('inserindo STAFF ')

            const id_staff = await postgres.query(`SELECT id FROM police_staff ORDER BY id DESC LIMIT 1`)
            const relationship_values = [
                number_report =  req.body.number_report,
                staff_id = id_staff.rows[0].id
            ]
            const relationship_query = `
                INSERT INTO report_staff(number_report, staff_id) VALUES($1, $2)
            `
            await postgres.query(relationship_query, relationship_values)
            console.log('inserindo STAFF RELACIONAMENTO')
        }
    }
    let majorPoints = 0
    console.log("++++++",req.body.natures);
    for(let i = 0; i < req.body.natures.length; i++){
        if(req.body.natures[i].punctuaction > majorPoints){
            majorPoints = req.body.natures[i].punctuaction
        }
    }
    const report_update_values = [
        number_report =  req.body.number_report,
        type_report = req.body.type_report,
        date_time = req.body.date_time,
        report_address = req.body.report_address,
        report_city = req.body.report_city,
        report_district = req.body.report_district,
        cep = req.body.cep,
        police_garrison = req.body.police_garrison,
        latitude = req.body.latitude,
        longitude = req.body.longitude,
        history = req.body.history,
        area = req.body.area,
        battalion = req.body.battalion,
        punctuaction = majorPoints,
        use_handcuffs = req.body.use_handcuffs,
        justify_handcuffs = req.body.justify_handcuffs,
        comments = req.body.comments,
        upm_contact = req.body.upm_contact,
        motivation_approach = req.body.motivation_approach,
        origin = req.body.origin
    ]
    const report_update_query = `
        UPDATE report 
        SET type_report = $2, date_time = $3, report_address = $4, 
            report_city = $5, report_district = $6, cep = $7, 
            police_garrison = $8,latitude = $9, longitude = $10, 
            history = $11, area = $12, battalion = $13, punctuaction = $14,
            use_handcuffs = $15 , justify_handcuffs = $16 , comments = $17,
            upm_contact = $18, motivation_approach = $19 , origin = $20
        WHERE number_report = $1
    `
    try {
        deleteRegisters()
        await deleteRelationship.deleteRelationship(number_report)
        nature_register()
        envolveds_register()
        objects_register()
        staff_register()
        postgres.query(report_update_query, report_update_values).then(
            res.status(201).send({message: 'reportt actualized success!'})
        )        
    } catch (error) {
        console.log(error);
    }

}


