const nodemailer = require('nodemailer')
const MailAccount = require('../Config/MailAccount')

/**
 * @param {?string} reciver
 * @param {?string} subject
 * @param {?any} content
 * @param {?string} htmlContent
 */

async function MailSender (reciver, subject, content, htmlContent){
    const Mail = await MailAccount.sendMail({
        from:'"Policia Militar - 26º BPM" informativos26bpm@gmail.com',
        to:reciver,
        subject:subject,
        text: String(content), 
        html: htmlContent
    })

}


module.exports = MailSender