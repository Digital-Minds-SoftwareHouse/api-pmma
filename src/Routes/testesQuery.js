const express = require('express')
const postgres = require('../../dbConfig')
const router = express.Router()


router.get('/', async (req,res,err)=> {

    const reports_envolveds = (await postgres.query(`
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



    res.send(reports_envolveds)
})

module.exports = router