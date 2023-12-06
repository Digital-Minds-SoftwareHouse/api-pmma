const mailer = require('nodemailer')

const transporter = mailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'informativos26bpm@gmail.com',
        pass: 'jjlvmtytvcvlsame'
    }
});

module.exports = transporter;