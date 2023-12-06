const postgres = require('../../dbConfig')

/**
 * @param {number} params 
 */

exports.deleteRelationship = async function (params) {
    await postgres.query(`DELETE FROM report_nature WHERE number_report = ${params}`).then(console.log("deletado relacionamento da natureza"))
    await postgres.query(`DELETE FROM report_envolved WHERE number_report = ${params}`).then(console.log("deletado relacionamento do envolvido"))
    await postgres.query(`DELETE FROM report_objects WHERE number_report = ${params}`).then(console.log("deletado relacionamento do objeto"))
    await postgres.query(`DELETE FROM report_staff WHERE number_report = ${params}`).then(console.log("deletado relacionamento da staff"))
}