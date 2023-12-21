const { Pool } = require('pg')
require('dotenv-safe').config()

let postgres = new Pool({
    host: process.env.HOST,
    port: process.env.PORT_DB,
    user: process.env.USER,
    password: process.env.PASSWORD_DB,
    ssl:true,
    database: process.env.DATA_BASE,
    connectionTimeoutMillis: 75000,
    idleTimeoutMillis: 75000,
    maxUses: 100
})
postgres.connect().then(()=>{console.log('DB Connected');},(e)=>{console.log('DB Conection Error: ', e)})
module.exports = postgres

//connectionString: "postgres://muniz:NZkB2RVY3BR4mgarlTckmfZ2I4hdvEqT@dpg-chvse7j3cv20nhpr66e0-a.oregon-postgres.render.com/dbbatalhao" ,

/*
postgres = new Pool({
    host: 'dpg-clo45dsjtl8s73ajj380-a.oregon-postgres.render.com',
    port: 5432,
    user: 'public_4iup_user',
    password: 'IPgoyJkthbdnaVrldFs3jhNuGaYhHhGU',
    ssl:true,
    database:'public_4iup',
    connectionTimeoutMillis: 75000,
    idleTimeoutMillis: 75000,
    maxUses: 100

postgres = new Pool({
    host: 'localhost',
    port: 5433,
    user: 'postgres',
    password: '123456',
    ssl:false,
    database:'postgres',
    connectionTimeoutMillis: 75000,
    idleTimeoutMillis: 75000,
    maxUses: 100



*/
