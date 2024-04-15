import { IEventHandler } from '@nestjs/cqrs';
import { EventsHandler } from '@nestjs/cqrs/dist/decorators/events-handler.decorator';
import { RoomBookedEvent } from '../room-booked.event';
import { EmailService } from '../../services/email.service';
import { CustomerService } from 'src/modules/backoffice/services/customer.service';

@EventsHandler(RoomBookedEvent)
export class RoomBookedHandler implements IEventHandler<RoomBookedEvent> {

    constructor(
        private readonly emailService: EmailService,
        private readonly customerService: CustomerService
    ) { }

    async handle(event: RoomBookedEvent) {
        // Recuperar o nome e o email do customer
        const customer = this.customerService.find(event.customerId);
        const emailCustomer = (await customer).email;
        const nameCustomer = (await customer).name;

        // Prepare o conteúdo do e-mail
        const emailContent = {
            to: emailCustomer,
            subject: 'Sala reservada',
            text: `Olá, ${nameCustomer}\n\nSua reserva para a sala ${event.roomId} foi confirmada para a data ${event.date}. Obrigado!`, // Mensagem de texto simples
        };

        // Enviar o e-mail usando o serviço de e-mail
        await this.emailService.sendEmail(emailContent.to, emailContent.subject, emailContent.text);
    }
}
