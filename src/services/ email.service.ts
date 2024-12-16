
import nodemailer from 'nodemailer';
import { Request } from 'express';
import { Service } from 'typedi';
import { EMAIL_PASS, EMAIL_TO, EMAIL_USER } from '@/config';


@Service()
export class EmailService {
    
    private transporter:nodemailer;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: EMAIL_USER,
                pass: EMAIL_PASS,
            },
        });
    }

    public async SendEmailForErrorApi(req: Request, status: number, message: string) {
        const mailOptions = {
            from: EMAIL_USER,
            to: EMAIL_TO,
            subject: `Error in API: ${message}`,
            text: `Error occurred at ${req.path}\nMethod: ${req.method}\nStatus: ${status}\nMessage: ${message}`,
        };

        try {
            await this.transporter.sendMail(mailOptions);
        } catch (emailError) {
            console.error('Failed to send error email:', emailError);
        }
    }

    public async SendEmailUsingCronJob(message: string) {
        
        const recipients = process.env.EMAIL_TO.split(' ');
        const mailOptions = {
            from: EMAIL_USER,
            to: recipients,
            subject: `Cron Job: ${message}`,
            text: `${message}`,
        };

        try {
            await this.transporter.sendMail(mailOptions);
        } catch (emailError) {
            console.error('Failed to send cron job email:', emailError);
        }
    }
}



