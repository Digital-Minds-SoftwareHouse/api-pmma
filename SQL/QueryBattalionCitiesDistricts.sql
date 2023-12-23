CREATE TABLE
    district(
        id SERIAL PRIMARY KEY,
        name VARCHAR(20)
    );
CREATE TABLE
    report_nature(
        id SERIAL PRIMARY KEY,
        number_report VARCHAR(60) REFERENCES report(number_report) ON DELETE CASCADE ON UPDATE CASCADE,
        nature_id INTEGER REFERENCES natures(id) ON DELETE ON UPDATE CASCADE
    );