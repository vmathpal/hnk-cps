import db from "../../models";
const nodemailer = require("nodemailer");
const email_template = db.email_templates;
import { Op, where } from "sequelize";
//import { sendMail } from '../../email/sendMail';

var transporter = nodemailer.createTransport({
  //service: 'gmail',
  //secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE : false,
  port: process.env.SMTP_PORT,
  host: process.env.SMTP_HOST,
  secureConnection: false,
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
  tls: {
    ciphers: "SSLv3",
  },
});

export const sendUserCreatedMail = async (newUser: any) => {
  const content: any = await db.email_templates.findOne({
    where: { variable_name: "USER_CREATED" },
  });
  // console.log("email template" + newUser.email);
  if (content) {
    const replace = {
      userId: newUser.userId,
      url: newUser.url,
    };
    const match: any = content.variables.split(",");
    let message = content.description;

    for (let i = 0; i <= match.length - 1; i++) {
      const msg = "{" + match[i] + "}";
      message = message.replace(msg, replace[match[i]]);
    }

    var mailOptions = {
      from: process.env.SMTP_USERNAME,
      to: newUser.email, // list of receivers
      subject: content.subject, // Subject line
      html: message,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log("Email Not sent" + error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  }
};

export const sendAdminCreatedMail = async (newUser: any) => {
  const content: any = await email_template.findOne({
    where: { variable_name: "ADMIN_CREATED" },
  });
  if (content) {
    const replace = {
      name: newUser.name,
      pass: newUser.pass,
      email: newUser.email,
      url: newUser.url,
    };
    const match: any = content.variables.split(",");
    let message = content.description;

    for (let i = 0; i <= match.length - 1; i++) {
      const msg = "{" + match[i] + "}";
      message = message.replace(msg, replace[match[i]]);
    }
    var mailOptions = {
      from: process.env.SMTP_USERNAME,
      to: newUser.email, // list of receivers
      subject: content.subject, // Subject line
      html: message,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  }
};

export const SendEmail = async (newUser: any, alias, cc = 0) => {
  // console.log(
  //   process.env.SMTP_USERNAME,
  //   process.env.SMTP_SECURE,
  //   process.env.SMTP_PORT,
  //   process.env.SMTP_HOST
  // );
  const content: any = await db.email_templates.findOne({
    where: { variable_name: alias },
  });
  var ccEmail = "";
  if (cc > 0) {
    const user: any = await db.User.findOne({
      where: { role: "super_admin" },
    });
    ccEmail = user.ccEmail ? user.ccEmail.split(",") : "";
  }

  if (content) {
    let message = content.description;

    Object.keys(newUser).forEach((key) => {
      const variable = "{" + key + "}";
      const replacer = new RegExp(variable, "g");
      message = message.replace(replacer, newUser[key]);
    });

    var mailOptions = {
      from: process.env.SMTP_USERNAME,
      to: newUser.email, // list of receivers
      subject: content.subject, // Subject line
      html: message,
      cc: ccEmail,
    };
    // console.log('sent....',newUser.email);

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  }
};
