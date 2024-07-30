"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendMail = (mailOptions) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transporter = yield nodemailer_1.default.createTransport({
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
        yield transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log('Mail Error >>>>>>>>>>', error);
            }
            else {
                console.log('Email sent: ' + info.response);
            }
        });
    }
    catch (error) {
        console.log('error', error);
    }
});
exports.sendMail = sendMail;
