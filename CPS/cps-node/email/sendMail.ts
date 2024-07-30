import nodemailer from 'nodemailer'
export const sendMail = async (mailOptions: any) => {
  try{
    const transporter = await nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true,
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
     // service: 'gmail',
    });
    mailOptions.from = {
      name: 'CPS System',
      address: "Singapore",
    };
    await transporter.sendMail(mailOptions, function (error: any, info: any) {
      if (error) {
        console.log('Mail Error >>>>>>>>>>',error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  
}catch(error){
console.log('error',error);
}
}