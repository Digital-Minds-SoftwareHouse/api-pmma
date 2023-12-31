const postgres = require('../../dbConfig')
const deleteRelationship = require('../Functions/deleteRelationship')

exports.getAllReports = async function (req, res, err){

    console.log('ROTA DE OCORRENCIAS');
    const reports = (await postgres.query(` 
        SELECT
            r.id,
            r.number_report,
            r.date_time,
            r.report_city,
            r.police_garrison,
            r.type_report,
            r.report_address,
            r.report_district,
            r.cep,
            r.police_garrison,
            r.latitude,
            r.longitude,
            r.history,
            r.area,
            r.battalion,
            r.punctuaction,
            r.use_handcuffs,
            r.justify_handcuffs,
            r.comments,
            r.upm_contact,
            r.motivation_approach,
            r.origin,
            COALESCE( json_agg(DISTINCT n.*), '[]'::json ) AS natures,
            COALESCE( json_agg(DISTINCT e.*), '[]'::json ) AS envolveds,
            COALESCE( json_agg(DISTINCT o.*), '[]'::json ) AS objects,
            COALESCE( json_agg(DISTINCT dr.*), '[]'::json ) AS detention_responsible,
            COALESCE( json_agg(DISTINCT ps.*), '[]'::json ) AS police_staff
        FROM report r
        LEFT JOIN report_staff rs ON r.number_report = rs.number_report
        LEFT JOIN police_staff ps ON rs.staff_id = ps.id
        LEFT JOIN report_nature rn ON r.number_report = rn.number_report
        LEFT JOIN natures n ON rn.nature_id = n.id
        LEFT JOIN report_objects ro ON r.number_report = ro.number_report
        LEFT JOIN objects o ON ro.object_id = o.id
        LEFT JOIN report_detention_responsible rdr ON r.number_report = rdr.number_report
        LEFT JOIN detention_responsible dr ON rdr.detention_responsible_id = dr.id
        LEFT JOIN report_envolved re ON r.number_report = re.number_report
        LEFT JOIN envolved e ON re.envolved_id = e.id
        GROUP BY r.id, r.number_report, r.date_time, r.report_city, r.police_garrison, ps.id_policial;    
    `)).rows

    res.status(302).send(reports)
}
exports.getSpecificReport = async function (req, res, err){
    let battalionParam = new String(req.params.battalion)
    let reportNumberParam = req.params.number_report

    console.log('ROTA DE OCORRENCIAS');
    const response = (await postgres.query(`
        SELECT
            r.id,
            r.number_report,
            r.date_time,
            r.report_city,
            r.police_garrison,
            r.type_report,
            r.report_address,
            r.report_district,
            r.cep,
            r.police_garrison,
            r.latitude,
            r.longitude,
            r.history,
            r.area,
            r.battalion,
            r.punctuaction,
            r.use_handcuffs,
            r.justify_handcuffs,
            r.comments,
            r.upm_contact,
            r.motivation_approach,
            r.origin,
            COALESCE( json_agg(DISTINCT n.*), '[]'::json ) AS natures,
            COALESCE( json_agg(DISTINCT e.*), '[]'::json ) AS envolveds,
            COALESCE( json_agg(DISTINCT o.*), '[]'::json ) AS objects,
            COALESCE( json_agg(DISTINCT dr.*), '[]'::json ) AS detention_responsible,
            COALESCE( json_agg(DISTINCT ps.*), '[]'::json ) AS police_staff
        FROM report r
        LEFT JOIN report_staff rs ON r.number_report = rs.number_report
        LEFT JOIN police_staff ps ON rs.staff_id = ps.id
        LEFT JOIN report_nature rn ON r.number_report = rn.number_report
        LEFT JOIN natures n ON rn.nature_id = n.id
        LEFT JOIN report_objects ro ON r.number_report = ro.number_report
        LEFT JOIN objects o ON ro.object_id = o.id
        LEFT JOIN report_detention_responsible rdr ON r.number_report = rdr.number_report
        LEFT JOIN detention_responsible dr ON rdr.detention_responsible_id = dr.id
        LEFT JOIN report_envolved re ON r.number_report = re.number_report
        LEFT JOIN envolved e ON re.envolved_id = e.id
        WHERE r.number_report = '${reportNumberParam}' AND r.battalion = '26 BPM'
        GROUP BY r.id, r.number_report, r.date_time, r.report_city, r.police_garrison, ps.id_policial;
    `)).rows

    res.status(302).send(response)
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
                bodily_injuries = req.body.envolveds[i].bodily_injuries,
                health_condition = req.body.envolveds[i].health_condition
            ]
            const envolved_query = `
                INSERT INTO envolved(  name, type_of_involvement, birthdate, mother, sex, gender,
                                        address, district, city, naturalness, race_color, 
                                        phone_number, rg, cpf, profession, particular_signs, bodily_injuries, health_condition )
                VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
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
    async function detention_responsible_register(){
        for(let i = 0; i < req.body.detention_responsible.length; i++){
            const staff_values = [
                graduation_rank = req.body.detention_responsible[i].graduation_rank,
                war_name = req.body.detention_responsible[i].war_name,
                id_policial = req.body.detention_responsible[i].id_policial,
                cpf = req.body.detention_responsible[i].cpf
            ]
            const staff_query = `
                INSERT INTO detention_responsible(graduation_rank, war_name, id_policial, cpf)
                VALUES($1, $2, $3, $4)
            `
            await postgres.query(staff_query, staff_values)

            const id_detention_responsible = await postgres.query(`SELECT id FROM detention_responsible ORDER BY id DESC LIMIT 1`)
            const relationship_values = [
                number_report = number_last_report,
                detention_responsible_id = id_detention_responsible.rows[0].id
            ]
            const relationship_query = `
                INSERT INTO report_detention_responsible(number_report, detention_responsible_id) VALUES($1, $2)
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
                staff_function = req.body.police_staff[i].staff_function,
                cpf = req.body.police_staff[i].cpf
            ]
            const staff_query = `
                INSERT INTO police_staff(graduation_rank, war_name, id_policial, staff_function, cpf)
                VALUES($1, $2, $3, $4,$5)
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
        detention_responsible_register()
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
    const nature_key = (await postgres.query(`
        SELECT 
            natures.id
        FROM natures
        LEFT JOIN report_nature ON report_nature.nature_id = natures.id
        WHERE report_nature.number_report = '${number_report}'    
    `)).rows
    const envolved_key = (await postgres.query(`
        SELECT 
        envolved.id
        FROM envolved
        LEFT join report_envolved ON report_envolved.envolved_id = envolved.id
        WHERE report_envolved.number_report = '${number_report}'  
    `)).rows
    const object_key = (await postgres.query(`
        SELECT 
            objects.id
        FROM objects
        LEFT JOIN report_objects ON report_objects.object_id = objects.id
        WHERE report_objects.number_report = '${number_report}' 
    `)).rows
    const staff_key = (await postgres.query(`
        SELECT 
            police_staff.id
        FROM police_staff
        LEFT JOIN report_staff ON report_staff.staff_id = police_staff.id
        WHERE report_staff.number_report = '${number_report}'
    `)).rows

    for(let i = 0; i < nature_key?.length; i++){
        await postgres.query(`DELETE FROM natures WHERE id = ${nature_key[i]?.id}`)
    }
    for(let j = 0; j < envolved_key?.length; j++){
        await postgres.query(`DELETE FROM envolved WHERE id = ${envolved_key[j]?.id}`)
    }
    for(let k = 0; k < object_key?.length; k++){
        await postgres.query(`DELETE FROM objects WHERE id = ${object_key[k]?.id}`)
    }
    for(let l = 0; l < staff_key?.length; l++){
        await postgres.query(`DELETE FROM police_staff WHERE id = ${staff_key[l]?.id}`)
    }
    postgres.query(`DELETE FROM report WHERE number_report = '${number_report}'`)
        res.status(201).send({message: "Deleting report success!", id: number_report})
    } catch (error) {
        res.status(500).send({message: "Error deleting report!"})
    }
}
exports.putReport = async function (req, res, err){
    console.log('PUT REPORTS');
    console.log(req.body);
    let number_report = req.body.number_report

    async function deleteRegisters(){
        const nature_key = (await postgres.query(`SELECT * FROM report_nature WHERE number_report = '${number_report}'`)).rows
        const envolved_key = (await postgres.query(`SELECT * FROM report_envolved WHERE number_report = '${number_report}'`)).rows
        const object_key = (await postgres.query(`SELECT * FROM report_objects WHERE number_report = '${number_report}'`)).rows
        const staff_key = (await postgres.query(`SELECT * FROM report_staff WHERE number_report = '${number_report}'`)).rows
        const detention_responsible_key = (await postgres.query(`SELECT * FROM report_detention_responsible WHERE number_report = '${number_report}'`)).rows

        
        for(let i = 0; i < nature_key.length; i++){
            postgres.query(`DELETE FROM natures WHERE id = ${nature_key[i].nature_id}`).then(console.log("natureza deletada"))
        }
        for(let j = 0; j < envolved_key.length; j++){
            postgres.query(`DELETE FROM envolved WHERE id = ${envolved_key[j].envolved_id}`).then(console.log("envolved deletada"))
        }
        for(let k = 0; k < object_key.length; k++){
            postgres.query(`DELETE FROM objects WHERE id = ${object_key[k].object_id}`).then(console.log("object deletada"))
        }
        for(let l = 0; l < staff_key.length; l++){
            postgres.query(`DELETE FROM police_staff WHERE id = ${staff_key[l].staff_id}`).then(console.log("staff deletada"))
        }
        for(let m = 0; m < detention_responsible_key.length; m++){
            postgres.query(`DELETE FROM detention_responsible WHERE id = ${detention_responsible_key[m].detention_responsible_id}`).then(console.log("detention deletada"))
        } 
    }
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
                number_report =  req.body.number_report,
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
                bodily_injuries = req.body.envolveds[i].bodily_injuries,
                health_condition = req.body.envolveds[i].health_condition
            ]
            const envolved_query = `
                INSERT INTO envolved(  name, type_of_involvement, birthdate, mother, sex, gender,
                                        address, district, city, naturalness, race_color, 
                                        phone_number, rg, cpf, profession, particular_signs, bodily_injuries, health_condition )
                VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
            `
            await postgres.query(envolved_query, envolveds_values)

            const id_envolved = await postgres.query("SELECT id FROM envolved ORDER BY id DESC LIMIT 1")
            const relationship_values = [
                number_report =  req.body.number_report,
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
                number_report =  req.body.number_report,
                object_id = id_object.rows[0].id
            ]
            const relationship_query = `
                INSERT INTO report_objects(number_report, object_id) VALUES($1, $2)
            `
            await postgres.query(relationship_query, relationship_values)
        }
    }
    async function detention_responsible_register(){
        for(let i = 0; i < req.body?.detention_responsible?.length; i++){
            const staff_values = [
                graduation_rank = req.body.detention_responsible[i].graduation_rank,
                war_name = req.body.detention_responsible[i].war_name,
                id_policial = req.body.detention_responsible[i].id_policial,
                cpf = req.body.detention_responsible[i].cpf
            ]
            const staff_query = `
                INSERT INTO detention_responsible(graduation_rank, war_name, id_policial, cpf)
                VALUES($1, $2, $3, $4)
            `
            await postgres.query(staff_query, staff_values)

            const id_detention_responsible = await postgres.query(`SELECT id FROM detention_responsible ORDER BY id DESC LIMIT 1`)
            const relationship_values = [
                number_report = req.body.number_report,
                detention_responsible_id = id_detention_responsible.rows[0].id
            ]
            const relationship_query = `
                INSERT INTO report_detention_responsible(number_report, detention_responsible_id) VALUES($1, $2)
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
                staff_function = req.body.police_staff[i].staff_function,
                cpf = req.body.police_staff[i].cpf
            ]
            const staff_query = `
                INSERT INTO police_staff(graduation_rank, war_name, id_policial, staff_function, cpf)
                VALUES($1, $2, $3, $4, $5)
            `
            await postgres.query(staff_query, staff_values)

            const id_staff = await postgres.query(`SELECT id FROM police_staff ORDER BY id DESC LIMIT 1`)
            const relationship_values = [
                number_report =  req.body.number_report,
                staff_id = id_staff.rows[0].id
            ]
            const relationship_query = `
                INSERT INTO report_staff(number_report, staff_id) VALUES($1, $2)
            `
            await postgres.query(relationship_query, relationship_values)
        }
    }
    let majorPoints = 0
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
        detention_responsible_register()
        staff_register()
        postgres.query(report_update_query, report_update_values).then(
            console.log({message: "REPORT ACTUALIZED SUCCESS!\n"}),
            res.status(201).send({message: 'reportt actualized success!'})
        )        
    } catch (error) {
        console.log(error);
    }

}


