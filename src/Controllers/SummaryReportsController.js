const postgres = require('../../dbConfig');

exports.getSummaryAllReports = async function (req, res, err){
    const query = `
    SELECT r.id, r.number_report, r.battalion ,r.date_time, r.report_city, r.police_garrison, ps.id_policial, string_agg(n.nature, ', ') AS naturezas
    FROM report r
    JOIN report_staff rs ON r.number_report = rs.number_report
    JOIN police_staff ps ON rs.staff_id = ps.id
    JOIN report_nature rn ON r.number_report = rn.number_report
    JOIN natures n ON rn.nature_id = n.id
    GROUP BY r.id, r.number_report, r.date_time, r.report_city, r.police_garrison, ps.id_policial;
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
    SELECT r.id, r.number_report, r.date_time, r.report_city, r.police_garrison, string_agg(n.nature, ', ') AS naturezas
    FROM report r
    JOIN report_nature rn ON r.number_report = rn.number_report
    JOIN natures n ON rn.nature_id = n.id
    GROUP BY r.id, r.number_report, r.date_time, r.report_city, r.police_garrison;
    `
    const response = await postgres.query(query)

    res.status(200).send({quantity:response.rowCount, reports: response.rows})
}
