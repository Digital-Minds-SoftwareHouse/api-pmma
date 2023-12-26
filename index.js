const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
//----------------------------------------------------------------------------------------
const http = require('http')
const port = process.env.PORT || 4000

const server = http.createServer(app)
const {Server} = require('socket.io')

const io = new Server(server,{
  cors: {
    'Access-Control-Allow-Origin': "*"
  }
})

server.listen(port,()=>{
  console.log('Rodando na porta: ', port)
})

module.exports = io
//----------------------------------------------------------------------------------------
const verifyJWT = require('./src/Middleware/JWTAuthMidleware')
const UsuariosRouter = require('./src/Routes/usuarios')
const DependentsRouter = require('./src/Routes/dependentes')
const LoginRouter = require('./src/Routes/login')
const PasswordRedefineRouter = require('./src/Routes/redefinirSenha')
const ReportsRouter = require('./src/Routes/reports')
const RegiterReportAccessRouter = require('./src/Routes/RegisterReportAccess')
const PdfGenerateRouter = require('./src/Routes/pdfGenerate')
const ReportsQuantityRouter = require('./src/Routes/reportsQuantity')
const TestesRouter = require("./src/Routes/testesQuery")


//app.use(cors())
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

app.use('/users', UsuariosRouter)
app.use('/login', LoginRouter)
app.use('/password', PasswordRedefineRouter )
app.use('/dependents', DependentsRouter)
app.use(express.static('./src/FileStorage/UserImages'))
app.use('/reports', ReportsRouter)
app.use('/permission', RegiterReportAccessRouter)
app.use('/pdf_generate', PdfGenerateRouter)
app.use('/reportsQuantity', ReportsQuantityRouter )
app.use('/testes', TestesRouter)
module.exports = app


