const nodemailer = require('nodemailer');
require('dotenv').config();
const path = require('path');
const fs = require('fs');
const handlebars = require('handlebars');
const EMAIL_TEMPLATE_BASE = path.join(__dirname, '../templates/emails/');
let emailClient = nodemailer.createTransport({

    host: String(process.env.EMAIL_HOST),
    port: parseInt(process.env.EMAIL_PORT),
    secure: true,
    auth: {
        user: String(process.env.EMAIL_NODEMAILER),
        pass: String(process.env.PASSWORD_EMAIL)
    }
});

const template = (fileName, data) => {
    const content = fs.readFileSync(EMAIL_TEMPLATE_BASE + fileName).toString();
    const inject = handlebars.compile(content);
    return inject(data);
};

function sendEmail(data) {
    if (!emailClient) {
        
        return;
    }
    return new Promise((resolve, reject) => {
        emailClient
            ? emailClient.sendMail(data, (err, info) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(info);
                }
            })
            : '';
    });
}
function CreateAccount({ role, Name, Email, password }) {
    return {
        from: process.env.EMAIL_NODEMAILER,
        to: Email,
        subject: `Creation compte ${Name}`,
        html: template('CreateAccount.html', { Name, Email, password, link: process.env.SIGNIN_URL })
    };
}
function DemandeEmail({ role, Name, Email }) {

    return {
        from: process.env.EMAIL_NODEMAILER,
        to: Email,
        subject: `Demande inscription ${role} ${Name}`,
        html: template('Demande.html', { role, Name, Email })
    };
}
function ResetPassword({ NewPassword, Name, Email }) {

    return {
        from: process.env.EMAIL_NODEMAILER,
        to: Email,
        subject: `Mot de passe oublié ${Name}`,
        html: template('ResetPassword.html', { NewPassword, Name })
    };
}
function WaitApproval({name, Email}) {
    return {
        from: process.env.EMAIL_NODEMAILER,
        to: Email,
        subject: `Demande d'inscription`,
        html: template('WaitApproval.html', { name })
    };
}
module.exports = {
    sendEmail,
    DemandeEmail,
    CreateAccount,
    ResetPassword,
    WaitApproval
}