const { Pool } = require('pg')
let postgres = new Pool({
    host: '127.0.0.1',
    port: 5433,
    user:'postgres',
    password: '123456',
    //database:'postgres',
    connectionTimeoutMillis: 75000,
    idleTimeoutMillis: 75000,
    maxUses: 200
})
postgres.connect().then(()=>{console.log('DB Connected');},(e)=>{console.log('DB Conection Error: ', e)})
module.exports = postgres

//connectionString: "postgres://muniz:NZkB2RVY3BR4mgarlTckmfZ2I4hdvEqT@dpg-chvse7j3cv20nhpr66e0-a.oregon-postgres.render.com/dbbatalhao" ,