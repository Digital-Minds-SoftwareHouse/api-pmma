const postgres = require('../../dbConfig');
const  PDFPrinter = require('pdfmake');
const { pdfReportDefinitions } = require('../Functions/pdfMake');

exports.pdfReportGenerate = async function(req,res,err){
    console.log('RODA DE PDF');
    let battalionParam = new String(req.params.battalion)
    let reportNumberParam = req.params.report_number

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
                envolved.profession,
                envolved.health_condition
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
                police_staff.staff_function,
                police_staff.cpf
            FROM police_staff
            LEFT JOIN report_staff ON report_staff.staff_id = police_staff.id
            WHERE report_staff.number_report = '${reportNumberParam}'
        `)).rows
        const detention_responsible = (await postgres.query(`
            SELECT 
                detention_responsible.id,
                detention_responsible.war_name,
                detention_responsible.graduation_rank,
                detention_responsible.id_policial,
                detention_responsible.cpf
            FROM detention_responsible
            LEFT JOIN report_detention_responsible ON report_detention_responsible.detention_responsible_id = detention_responsible.id
            WHERE report_detention_responsible.number_report = '${reportNumberParam}'
        `)).rows
        const response ={ 
            number_report: reports[0]?.number_report,
            type_report: reports[0]?.type_report,
            date_time: reports[0]?.date_time,
            report_address: reports[0]?.report_address,
            report_district: reports[0]?.report_district,
            report_city: reports[0]?.report_city,
            cep: reports[0]?.cep,
            police_garrison: reports[0]?.police_garrison,
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
            detention_responsible : detention_responsible,
            police_staff: police_staff,
        }
        //************************************************************************************************************
            const fonts = {
                Courier: {
                  normal: 'Courier',
                  bold: 'Courier-Bold',
                  italics: 'Courier-Oblique',
                  bolditalics: 'Courier-BoldOblique'
                },
                Helvetica: {
                  normal: 'Helvetica',
                  bold: 'Helvetica-Bold',
                  italics: 'Helvetica-Oblique',
                  bolditalics: 'Helvetica-BoldOblique'
                },
                Times: {
                  normal: 'Times-Roman',
                  bold: 'Times-Bold',
                  italics: 'Times-Italic',
                  bolditalics: 'Times-BoldItalic'
                },
                Symbol: {
                  normal: 'Symbol'
                },
                ZapfDingbats: {
                  normal: 'ZapfDingbats'
                }
              };
            const printer = new PDFPrinter(fonts)
            const docDefinitions = pdfReportDefinitions(response)
            const pdfDoc = printer.createPdfKitDocument(docDefinitions)
            const chunks = []
            pdfDoc.on("data", (chunk)=>{
                chunks.push(chunk)
            })
            pdfDoc.end()
            pdfDoc.on("end", ()=>{
                const result = Buffer.concat(chunks)
                res.end(result)
            })         
    }
    
    



}