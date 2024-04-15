import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AgendaController } from './controllers/agenda.controller';
import { RoomBookService } from './services/room-book.service';
import { RoomRepository } from './repositories/room.repository';
import { CommandHandlers } from './commands/handlers';
import { EventHandlers } from './events/handlers';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomSchema } from './schemas/room.schema';
import { EmailService } from './services/email.service';
import { SendGridModule } from '@ntegral/nestjs-sendgrid';
import { CustomerService } from '../backoffice/services/customer.service';
import { CustomerSchema } from '../backoffice/schemas/customer.schema';
import { UserSchema } from '../backoffice/schemas/user.schema';

@Module({
    imports: [
        CqrsModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        MongooseModule.forFeature([
            {
                name: 'Room',
                schema: RoomSchema
            },
            {
                name: 'Customer',
                schema: CustomerSchema
            },
            {
                name: 'User',
                schema: UserSchema
            }
        ]),
        SendGridModule.forRoot({
            apiKey: process.env.SENDGRID_API_KEY,
        }),
    ],
    controllers: [AgendaController],
    providers: [
        RoomBookService,
        EmailService,
        RoomRepository,
        ...CommandHandlers,
        ...EventHandlers,
        CustomerService
    ],
})
export class AgendaModule { }
