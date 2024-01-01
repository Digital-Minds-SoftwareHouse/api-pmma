const postgres = require('../../dbConfig');

exports.getSummaryAllReports = async function (req, res, err){
    const query = `
    SELECT r.id, r.number_report, r.battalion ,r.date_time, r.report_city, r.police_garrison, string_agg(n.nature, ', ') AS naturezas
    FROM report r
    LEFT JOIN report_staff rs ON r.number_report = rs.number_report
    LEFT JOIN police_staff ps ON rs.staff_id = ps.id
    LEFT JOIN report_nature rn ON r.number_report = rn.number_report
    LEFT JOIN natures n ON rn.nature_id = n.id
    GROUP BY r.id, r.number_report, r.date_time, r.report_city, r.police_garrison;
    `
    const query2 = `SELECT * FROM report`
    
    const response = await postgres.query(query)
    const responseQuantity = await postgres.query(query2)
    res.status(200).send({quantity:responseQuantity.rowCount, reports: response.rows})

}
exports.reportsPerOfficer = async function (req, res, err){
    const officerId = req.body.officerId
    console.log(officerId);
    const query = `
    SELECT r.id, r.number_report, r.date_time, r.report_city, r.police_garrison,r.punctuaction, ps.id_policial, string_agg(n.nature, ', ') AS naturezas
    FROM report r
    JOIN report_staff rs ON r.number_report = rs.number_report
    JOIN police_staff ps ON rs.staff_id = ps.id
    JOIN report_nature rn ON r.number_report = rn.number_report
    JOIN natures n ON rn.nature_id = n.id
    WHERE ps.id_policial = ${officerId}
    GROUP BY r.id, r.number_report, r.date_time, r.report_city, r.police_garrison, ps.id_policial;
    `
    const response = await postgres.query(query)
    
    const data = response.rows
    let totalPunctuaction = 0
    
    for (let i = 0; i < data?.length; i++){
        totalPunctuaction += data[i]?.punctuaction
    }

    console.log(totalPunctuaction);
    res.status(200).send({quantity:response.rowCount,totalPunctuaction: totalPunctuaction,  reports: response.rows})
}
