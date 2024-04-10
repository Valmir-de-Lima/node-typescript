import { Body, Controller, HttpException, HttpStatus, Param, Post, Put, UseInterceptors } from "@nestjs/common";
import { Result } from "../models/result.model";
import { ValidatorInterceptor } from "src/interceptors/validator.interceptor";
import { Pet } from "../models/pet.model";
import { CreatePetContract } from "../contracts/pet/create-pet.contract";
import { PetService } from "../services/pet.service";

@Controller('v1/pets')
export class PetController {
    constructor(
        private readonly service: PetService) {

    }

    // localhost:3000/v1/pets/12345678911
    @Post(':document')
    @UseInterceptors(new ValidatorInterceptor(new CreatePetContract()))
    async createPet(@Param('document') document, @Body() model: Pet) {
        try {
            await this.service.create(document, model);
            return new Result('Pet criado com sucesso', true, model, null);
        } catch (error) {
            // Rollback manual
            throw new HttpException(new Result('Nao foi possível criar o Pet', false, null, error), HttpStatus.BAD_REQUEST);
        }
    }

    // localhost:3000/v1/pets/12345678911/123456789123456789
    @Put(':document/:id')
    @UseInterceptors(new ValidatorInterceptor(new CreatePetContract()))
    async updatePet(@Param('document') document, @Param('id') id, @Body() model: Pet) {
        try {
            await this.service.update(document, id, model);
            return new Result('Pet atualizado com sucesso', true, model, null);
        } catch (error) {
            // Rollback manual
            throw new HttpException(new Result('Nao foi possível criar o Pet', false, null, error), HttpStatus.BAD_REQUEST);
        }
    }
}