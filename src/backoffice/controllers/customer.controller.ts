import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, UseInterceptors } from "@nestjs/common";
import { Result } from "../models/result.model";
import { ValidatorInterceptor } from "src/interceptors/validator.interceptor";
import { CreateCustomerContract } from "../contracts/customer/create-customer.contract";
import { CreateCustomerDto } from "../dtos/create-customer.dto";
import { AccountService } from "../services/account.service";
import { User } from "../models/user.model";
import { CustomerService } from "../services/customer.service";
import { Customer } from "../models/customer.model";
import { Address } from "../models/address.model";
import { CreateAddressContract } from "../contracts/customer/create-address.contract";
import { Pet } from "../models/pet.model";
import { CreatePetContract } from "../contracts/customer/create-pet.contract";
import { QueryDto } from "../dtos/query.dto";
import { ListCustomerContract } from "../contracts/customer/list-customer.contract";

@Controller('v1/customers')
export class CustomerController {
    constructor(
        private readonly accountService: AccountService,
        private readonly customerService: CustomerService) {

    }

    @Get()
    async getAll() {
        const customers = await this.customerService.findAll();
        return new Result('Listagem de clientes bem sucedida', true, customers, null);
    }

    @Get(':document')
    async get(@Param('document') document: string) {
        const customer = await this.customerService.find(document);
        return new Result('Detalhes do cliente bem sucedida', true, customer, null);
    }

    @Post('query')
    @UseInterceptors(new ValidatorInterceptor(new ListCustomerContract()))
    async query(@Body() model: QueryDto) {
        const customers = await this.customerService.query(model);
        return new Result('Listagem de clientes bem sucedida', true, customers, null);
    }

    @Post()
    @UseInterceptors(new ValidatorInterceptor(new CreateCustomerContract()))
    async post(@Body() model: CreateCustomerDto) {
        let user;
        let customer;
        try {
            user = await this.accountService.create(new User(model.document, model.password, true));
            customer = new Customer(model.name, model.document, model.email, [], null, null, null, user);
            const res = await this.customerService.create(customer);
            return new Result('Cliente criado com sucesso', true, res, null);
        } catch (error) {
            // Rollback manual
            this.accountService.remove(user.id);
            throw new HttpException(new Result('Nao foi possível realizar o cadastro', false, null, error), HttpStatus.BAD_REQUEST);
        }
    }

    @Post('addresses/billing/:document')
    @UseInterceptors(new ValidatorInterceptor(new CreateAddressContract()))
    async addBillingAddress(@Param('document') document, @Body() model: Address) {
        try {
            await this.customerService.addBillingAddress(document, model);
            return new Result('Endereço adicionado com sucesso', true, model, null);;
        } catch (error) {
            // Rollback manual
            throw new HttpException(new Result('Nao foi possível adicionar o endereço', false, null, error), HttpStatus.BAD_REQUEST);
        }
    }

    @Post('addresses/shipping/:document')
    @UseInterceptors(new ValidatorInterceptor(new CreateAddressContract()))
    async addShippingAddress(@Param('document') document, @Body() model: Address) {
        try {
            await this.customerService.addShippingAddress(document, model);
            return new Result('Endereço adicionado com sucesso', true, model, null);
        } catch (error) {
            // Rollback manual
            throw new HttpException(new Result('Nao foi possível adicionar o endereço', false, null, error), HttpStatus.BAD_REQUEST);
        }
    }

    @Post('pets/:document')
    @UseInterceptors(new ValidatorInterceptor(new CreatePetContract()))
    async createPet(@Param('document') document, @Body() model: Pet) {
        try {
            await this.customerService.createPet(document, model);
            return new Result('Pet criado com sucesso', true, model, null);
        } catch (error) {
            // Rollback manual
            throw new HttpException(new Result('Nao foi possível criar o Pet', false, null, error), HttpStatus.BAD_REQUEST);
        }
    }

    @Put('pets/:document/:id')
    @UseInterceptors(new ValidatorInterceptor(new CreatePetContract()))
    async updatePet(@Param('document') document, @Param('id') id, @Body() model: Pet) {
        try {
            await this.customerService.updatePet(document, id, model);
            return new Result('Pet atualizado com sucesso', true, model, null);
        } catch (error) {
            // Rollback manual
            throw new HttpException(new Result('Nao foi possível criar o Pet', false, null, error), HttpStatus.BAD_REQUEST);
        }
    }

    @Put(':document')
    put(@Param('document') document, @Body() body) {
        return new Result('Cliente atualizado com sucesso', true, body, null);
    }

    @Delete(':document')
    delete(@Param('document') document) {
        return new Result('Cliente excluído com sucesso', true, null, null);
    }
}