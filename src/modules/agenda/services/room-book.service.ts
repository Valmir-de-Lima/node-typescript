import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { BookRoomCommand } from '../commands/book-room.command';
import { RoomBookedEvent } from '../events/room-booked.event';

@Injectable()
export class RoomBookService {
    constructor(
        private readonly commandBus: CommandBus
    ) { }

    async Book(customerId: string, roomId: string) {
        console.log('RoomBookService - Executando o servico...');

        return await this.commandBus.execute(
            new BookRoomCommand(customerId, roomId)
        );
    }
}