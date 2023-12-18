const postgres = require('../../dbConfig')

exports.reportsAllQuantity = async function (req, res, err){
    const total = ''
    
    const response = (await postgres.query('SELECT * FROM report' )).rowCount
    
    res.status(200).send({total_reports: response})
}