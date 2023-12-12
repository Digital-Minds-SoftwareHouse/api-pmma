const postgres = require('../../dbConfig');
const  PDFPrinter = require('pdfmake');
const { pdfReportDefinitions } = require('../Functions/pdfMake');

exports.pdfReportGenerate = async function(req,res,err){
    console.log('RODA DE PDF');
    const battalionParam = req.params.battalion
    const reportNumberParam = req.params.report_number

    const reports = (await postgres.query(` SELECT * FROM report WHERE battalion = '26 BPM' AND number_report = '126BPM2023'`)).rows

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
                police_garrison: reports[i].police_garrison,
                latitude: reports[i].latitude,
                longitude: reports[i].longitude,
                history: reports[i].history,
                area: reports[i].area,
                battalion: reports[i].battalion,
                punctuaction: reports[i].punctuaction,
                natures: nature_array.map(item=>item),
                envolveds: envolved_array.map(item=>item),
                objects: objects_array.map(item=>item),
                police_staff: staff_array.map(item=>item)
            }
        )        
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
    const docDefinitions = pdfReportDefinitions(response_array)
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