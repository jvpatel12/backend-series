
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});
// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"bank-api" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

async function  sendRegistrationEmail(userEmail,name) {
     const subject  = "welcome to Bank api!";
     const text = `hello ${name}\n\n Thank you for register to Bank api`;
     const html = `<p> Hello ${name} Thank you connect to me </p>`;

      await sendEmail(userEmail,subject,text,html);
}

  async function sendTransactionEmail(userEmail,name,amount,toAccount){
    const subject = 'Transaction Sucessfully';
    const text = `hello ${name} \n\n Your transaction of $${amount} to account`;
    const html = `<p> Hello  ${name} Your transaction </p>`

    await sendEmail(userEmail,subject,text,html);
  }

  async function sendTransactionFailedEmail(userEmail,name,amount,toAccount){
    const subject = 'Transaction Failed';
    const text = `hello ${name} \n\n Your transaction of $${amount} to account failed`;
    const html = `<p> Hello  ${name} Your transaction failed </p>`

    await sendEmail(userEmail,subject,text,html);
  }



module.exports = {
    sendRegistrationEmail,
    sendTransactionEmail,
    sendTransactionFailedEmail
};