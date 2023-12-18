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
                id: reports[i].id,
                number_report: reports[i].number_report,
                report_city: reports[i].report_city,
                type_report: reports[i].type_report,
                date_time: reports[i].date_time,
                police_garrison: reports[i].police_garrison,         
                area: reports[i].area,
                battalion: reports[i].battalion,
                natures: nature_array.map(item=>item),
            }
        )        
    }
    res.status(302).send(response_array)
}
exports.reportsPerOfficer = async function (req, res, err){
    const officerId = req.body.officerId
    console.log(officerId);
    const query = `
    SELECT r.id, r.number_report, r.date_time, r.report_city, r.police_garrison, ps.id_policial, string_agg(n.nature, ', ') AS naturezas
    FROM report r
    JOIN report_staff rs ON r.number_report = rs.number_report
    JOIN police_staff ps ON rs.staff_id = ps.id
    JOIN report_nature rn ON r.number_report = rn.number_report
    JOIN natures n ON rn.nature_id = n.id
    WHERE ps.id_policial = ${officerId}
    GROUP BY r.id, r.number_report, r.date_time, r.report_city, r.police_garrison, ps.id_policial;
    `
    const response = await postgres.query(query)

    res.status(200).send({quantity:response.rowCount, reports: response.rows})
}