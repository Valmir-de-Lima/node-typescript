import { AggregateRoot } from '@nestjs/cqrs';
import { RoomBookedEvent } from '../events/room-booked.event';
import { RoomBookedHandler } from '../events/handlers/room-booked.handler';

export class Room extends AggregateRoot {
    constructor(private readonly id: string
    ) {
        super();
    }

    book(customerId: string) {
        // Regras de negócio e/ou eventos
        console.log('Room: reservando para o cliente ' + customerId + ' a sala ' + this.id)

        this.apply(new RoomBookedEvent(customerId, this.id));

        //this.apply(new RoomBookedEvent(customerId, this.id));
    }
}