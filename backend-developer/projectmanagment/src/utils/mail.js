import Mailgen from "mailgen";
import nodemailer from "nodemailer";

// create a Mailgen instance once
const mailGenerator = new Mailgen({
    theme: "default",
    product: {
        name: "Task Manager",
        link: "http://localhost:3000/",
    },
});

const sendEmail = async (options) => {
    // generate plaintext and html using the provided mailgen context
    const emailTextual = mailGenerator.generatePlaintext(options.mailgenContext);
    const emailHtml = mailGenerator.generate(options.mailgenContext);

    const transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_SMTP_HOST,
        port: Number(process.env.MAILTRAP_SMTP_PORT) || 2525,
        auth: {
            user: process.env.MAILTRAP_SMTP_USER,
            pass: process.env.MAILTRAP_SMTP_PASS,
        },
    });

    const mailOptions = {
        from: "mail.taskmanager@example.com",
        to: options.email,
        subject: options.subject,
        text: emailTextual,
        html: emailHtml,
    };

    await transporter.sendMail(mailOptions);
};

const emailVerificationMailgenContent = (username,verificationUrl) =>{
    return {
        body:{
            name:username,
            intro:"welcome to jeel patel vlog",

            action:{
                instuctions:"click the button below to verify your email",
                button:{
                    color:"blue",
                    text:"verfiy your email",
                    Link:verificationUrl
                },
            },
            outro:"any kind help needed, just reply to email"
        },
    };
};



const forgotPasswordMailgenContent = (username,passwordResetUrl) =>{
    return {
        body:{
            name:username,
            intro:"welcome to forgot password vlog",

            action:{
                instuctions:"click the button below to forgot the password",
                button:{
                    color:"blue",
                    text:"forgot your password",
                    Link:passwordResetUrl,
                },
            },
            outro:"any kind help needed, just reply to email"
        },
    };
};



export { sendEmail, emailVerificationMailgenContent, forgotPasswordMailgenContent };