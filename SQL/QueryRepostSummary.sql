SELECT r.id, r.number_report, r.date_time, r.report_city, r.police_garrison, ps.id_policial, n.nature
FROM report r
JOIN report_staff rs ON r.number_report = rs.number_report
JOIN police_staff ps ON rs.staff_id = ps.id
JOIN report_nature rn ON r.number_report = rn.number_report
JOIN natures n ON rn.nature_id = n.id
WHERE ps.id_policial = 821390;



/*'PRO CASO DE MAIS DE UM REGISTRO NNA MESMA CELULA '*/

SELECT r.id, r.number_report, r.date_time, r.report_city, r.police_garrison, ps.id_policial, GROUP_CONCAT(n.nature SEPARATOR ', ') AS naturezas
FROM report r
JOIN report_staff rs ON r.number_report = rs.number_report
JOIN police_staff ps ON rs.staff_id = ps.id
JOIN report_nature rn ON r.number_report = rn.number_report
JOIN natures n ON rn.nature_id = n.id
WHERE ps.id_policial = 821391
GROUP BY r.id, r.number_report, r.date_time, r.report_city, r.police_garrison, ps.id_policial;

/*CÓDIGO ACIMA FATORADO PARA O POSTGRES*/

SELECT r.id, r.number_report, r.date_time, r.report_city, r.police_garrison, ps.id_policial, string_agg(n.nature, ', ') AS naturezas
    FROM report r
    JOIN report_staff rs ON r.number_report = rs.number_report
    JOIN police_staff ps ON rs.staff_id = ps.id
    JOIN report_nature rn ON r.number_report = rn.number_report
    JOIN natures n ON rn.nature_id = n.id
    WHERE ps.id_policial = ${credentials[0]}
    GROUP BY r.id, r.number_report, r.date_time, r.report_city, r.police_garrison, ps.id_policial;