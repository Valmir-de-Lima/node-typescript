import { AggregateRoot } from '@nestjs/cqrs';
import { RoomBookedEvent } from '../events/room-booked.event';

export class Room extends AggregateRoot {
    constructor(
        public id: string,
        public customerId: string,
        public date: Date
    ) {
        super();
        this.autoCommit = true;
    }

    book(customerId: string, date: Date) {
        // Regras de negócio

        this.apply(new RoomBookedEvent(customerId, this.id, date));
    }
}