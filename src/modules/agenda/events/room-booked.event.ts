export class RoomBookedEvent {
    constructor(
        public readonly customerId: string,
        public readonly roomId: string
    ) {
        console.log('Enviando email para o cliente ' + customerId + ' sobre a reserva da sala ' + roomId)
    }
}