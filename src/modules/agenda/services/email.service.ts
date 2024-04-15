import { Injectable, OnModuleInit } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { InjectSendGrid, SendGridService } from '@ntegral/nestjs-sendgrid';

@Injectable()
export class EmailService {
    constructor(@InjectSendGrid() private readonly mailerService: SendGridService) { }

    async sendEmail(to: string, subject: string, content: string): Promise<void> {
        const mailOptions = {
            to: to,
            from: 'valmirblima7@gmail.com',
            subject: subject,
            html: content
        };

        try {
            this.mailerService.send(mailOptions);
        } catch (error) {
            console.error('Erro ao enviar e-mail:', error);
            throw new Error('Erro ao enviar e-mail');
        }
    }
}
