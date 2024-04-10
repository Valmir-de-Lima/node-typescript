import { Body, Controller, HttpException, HttpStatus, Param, Post, UseInterceptors } from "@nestjs/common";
import { Result } from "../models/result.model";
import { ValidatorInterceptor } from "src/interceptors/validator.interceptor";
import { Address } from "../models/address.model";
import { AddressService } from "../services/address.service";
import { AddressType } from "../enums/address-type.enum";
import { CreateAddressContract } from "../contracts/address/create-address.contract";


@Controller('v1/addresses')
export class AddressController {
    constructor(
        private readonly service: AddressService
    ) { }

    // localhost:3000/v1/addresses/billing/12345678911
    @Post('billing/:document')
    @UseInterceptors(new ValidatorInterceptor(new CreateAddressContract()))
    async addBillingAddress(@Param('document') document, @Body() model: Address) {
        try {
            await this.service.create(document, model, AddressType.Billing);
            return new Result('Endereço adicionado com sucesso', true, model, null);;
        } catch (error) {
            // Rollback manual
            throw new HttpException(new Result('Nao foi possível adicionar o endereço', false, null, error), HttpStatus.BAD_REQUEST);
        }
    }

    // localhost:3000/v1/addresses/shipping/12345678911
    @Post('shipping/:document')
    @UseInterceptors(new ValidatorInterceptor(new CreateAddressContract()))
    async addShippingAddress(@Param('document') document, @Body() model: Address) {
        try {
            await this.service.create(document, model, AddressType.Shipping);
            return new Result('Endereço adicionado com sucesso', true, model, null);
        } catch (error) {
            // Rollback manual
            throw new HttpException(new Result('Nao foi possível adicionar o endereço', false, null, error), HttpStatus.BAD_REQUEST);
        }
    }
}