import { InjectModel } from '@nestjs/mongoose';
import { Room } from '../models/room.model';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RoomRepository {
    constructor(
        @InjectModel('Room') private readonly model: Model<Room>) { }

    async checkAvailability(id: string, customerId: string, date: Date): Promise<Room | null> {
        try {
            const room = await this.model.findOne({ id: id, date: date });

            if (!room) {
                // Se a sala não existir para o ID e data fornecidos, crie uma nova e retorne
                return new Room(id, customerId, date);
            } else {
                // Se a sala já existir, retorne null para indicar que não está disponível
                return null;
            }
        } catch (error) {
            console.error('Erro ao verificar a disponibilidade da sala:', error);
            throw error; // Você pode querer tratar de forma diferente dependendo do contexto
        }
    }

    async book(data: Room): Promise<Room> {
        const room = new this.model(data);
        return await room.save();
    }
}