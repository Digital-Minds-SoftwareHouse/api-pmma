const postgres = require('../../dbConfig');

exports.getSummaryAllReports = async function (req, res, err){

    console.log('ROTA DE OCORRENCIAS');
    const reports = (await postgres.query(` SELECT * FROM report`)).rows
    const reports_natures = (await postgres.query('SELECT * FROM report_nature')).rows
    const natures = (await postgres.query('SELECT * FROM natures')).rows
    const response_array = []

    for(let i = 0; i < reports.length; i++){
        let nature_array = []
        for(let k = 0; k < reports_natures.length; k++ ){
            if(reports[i].number_report === reports_natures[k].number_report){
                nature_array.push(natures[k])
            }
        }
        response_array.push(
            { 
                number_report: reports[i].number_report,
                type_report: reports[i].type_report,
                date_time: reports[i].date_time,
                police_garrison: reports[i].police_garrisson,         
                area: reports[i].area,
                battalion: reports[i].battalion,
                natures: nature_array.map(item=>item),
            }
        )        
    }
    res.status(302).send(response_array)
}