import { BookRoomCommand } from "../book-room.command";
import { EventPublisher, CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { RoomRepository } from "../../repositories/room.repository";
import { HttpException, HttpStatus } from "@nestjs/common";

@CommandHandler(BookRoomCommand)
export class BookRoomHandler implements ICommandHandler<BookRoomCommand> {
    constructor(
        private readonly repository: RoomRepository,
        private readonly publisher: EventPublisher,
    ) { }

    async execute(command: BookRoomCommand) {
        const room = await this.repository.checkAvailability(command.roomId, command.customerId, command.date);

        if (room !== null) {
            const roomContext = this.publisher.mergeObjectContext(room);
            roomContext.book(command.customerId, command.date);
            await this.repository.book(roomContext);
            return;
        }

        throw new Error("Sala não disponível");
    }
}