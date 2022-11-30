const nodemailer = require("nodemailer");

const authData = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    }
});



function sendMail(to, text, subject){
    console.log(process.env.EMAIL, process.env.PASSWORD)
    authData.sendMail({
        to,
        from: "Appointment app",
        text,
        subject,
    }).then(() => {
       
    }).catch(error => {
        console.log(error);
    });
}

module.exports = sendMail;