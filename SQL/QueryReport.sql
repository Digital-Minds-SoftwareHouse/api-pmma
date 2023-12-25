CREATE TABLE
    report(
        id SERIAL,
        number_report VARCHAR(60) PRIMARY KEY,
        type_report VARCHAR(100),
        date_time TIMESTAMP,
        report_address VARCHAR(300),
        report_city VARCHAR(100),
        report_district VARCHAR(100),
        CEP VARCHAR(12),
        police_garrison VARCHAR(50),
        latitude VARCHAR(20),
        longitude VARCHAR(20),
        history TEXT,
        area VARCHAR(50),
        battalion VARCHAR(20),
        punctuaction INTEGER
    );
CREATE TABLE
    envolved(
        id SERIAL PRIMARY KEY REFERENCES report_envolved(envolved_id) ON DELETE CASCADE,
        name VARCHAR(200),
        type_of_involvement VARCHAR(50),
        birthdate TIMESTAMP,
        mother VARCHAR(200),
        sex VARCHAR(15),
        gender VARCHAR(20),
        address VARCHAR(200),
        city VARCHAR(100),
      	district VARCHAR(150),
        naturalness VARCHAR(100),
        race_color VARCHAR(30),
        phone_number VARCHAR(30),
        rg BIGINT,
        cpf VARCHAR(30),
        particular_signs TEXT,
        health_condition VARCHAR(100),
        bodily_injuries TEXT
    );
CREATE TABLE
    natures(
        id SERIAL PRIMARY KEY REFERENCES report_nature(nature_id) ON DELETE CASCADE,
        nature VARCHAR(100),
        punctuaction INTEGER
    );
CREATE TABLE
    objectssss(
        id SERIAL PRIMARY KEY REFERENCES report_objects(object_id) ON DELETE CASCADE,
        type VARCHAR(50),
        subtype VARCHAR(50),
        description VARCHAR(200),
        quantity VARCHAR(100),
        serial_number VARCHAR(100),
        chassis VARCHAR(100),
        brand VARCHAR(100),
        model VARCHAR(100),
        plate VARCHAR(20),
        color VARCHAR(30),
        stolen_recovered BOOLEAN,
      	caliber VARCHAR(30)
    );
CREATE TABLE
    police_staff(
        id SERIAL PRIMARY KEY REFERENCES report_staff(staff_id)  ON DELETE CASCADE,
        war_name VARCHAR(150),
        graduation_rank VARCHAR(20),
        id_policial INTEGER,
      	staff_function VARCHAR(30)
    );
CREATE TABLE
    report_permissions(
        id SERIAL PRIMARY KEY,
        battalion VARCHAR(20),
        permission BOOLEAN,
      	date_request TIMESTAMP,
      	request_closed BOOLEAN,
        id_policial INTEGER,
      	war_name VARCHAR(150),
      	graduation_rank VARCHAR(20)
    );
CREATE TABLE
    report_nature(
        id SERIAL PRIMARY KEY,
        number_report VARCHAR(60) REFERENCES report(number_report) ON DELETE CASCADE ON UPDATE CASCADE,
        nature_id INTEGER REFERENCES natures(id) ON DELETE ON UPDATE CASCADE
    );
CREATE TABLE
    report_envolved(
        id SERIAL PRIMARY KEY,
        number_report VARCHAR(60) REFERENCES report(number_report) ON DELETE CASCADE ON UPDATE CASCADE,
        envolved_id INTEGER REFERENCES envolved(id) ON DELETE ON UPDATE CASCADE
    );
CREATE TABLE
    report_objects(
        id SERIAL PRIMARY KEY,
        number_report VARCHAR(60) REFERENCES report(number_report) ON DELETE CASCADE ON UPDATE CASCADE,
        object_id INTEGER REFERENCES objects(id) ON DELETE ON UPDATE CASCADE
    );
CREATE TABLE
    report_staff(
        id SERIAL PRIMARY KEY,
        number_report VARCHAR(60) REFERENCES report(number_report) ON DELETE CASCADE ON UPDATE CASCADE,
        staff_id INTEGER REFERENCES police_staff(id) ON DELETE ON UPDATE CASCADE

    );
CREATE TABLE
    natures_list(
        id SERIAL PRIMARY KEY,
        nature VARCHAR(100),
        punctuaction INTEGER
    );
