import { Controller, Post, Body, UseGuards, Req, HttpException, HttpStatus } from "@nestjs/common";
import { RoomBookService } from "../services/room-book.service";
import { BookRoomDto } from "../dtos/book-room.dto";
import { JwtAuthGuard } from "src/shared/guards/auth.guard";
import { BookRoomCommand } from "../commands/book-room.command";
import { Result } from "src/modules/backoffice/models/result.model";

@Controller('v1/rooms')
export class AgendaController {
    constructor(private readonly service: RoomBookService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    async Book(@Req() req, @Body() model: BookRoomDto) {
        try {
            var command = new BookRoomCommand(req.user.document, model.roomId, model.date);
            await this.service.Book(command);
            return {
                message: 'Reserva realizada com sucesso',
                customer: req.user.document,
                room: model.roomId,
                date: model.date
            }
        } catch (error) {
            throw new HttpException(new Result('Nao foi possível reservar sua sala', false, null, error.message), HttpStatus.BAD_REQUEST);

        }
    }
}