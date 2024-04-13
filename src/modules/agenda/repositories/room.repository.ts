import { Injectable } from '@nestjs/common';
import { Room } from '../models/room.model';

@Injectable()
export class RoomRepository {

    async findOneById(id: string): Promise<Room> {
        console.log('RoomRepository:findOneById: Recuperando a sala...');
        return new Room(id);
    }

    async checkAvailability(id: string): Promise<Room> {
        // TODO: Ler do banco
        return new Room(id);
    }

    async book(room: Room) {
        // TODO: Salvar no banco
    }
}