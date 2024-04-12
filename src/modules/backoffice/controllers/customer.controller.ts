import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, UseInterceptors } from "@nestjs/common";
import { Result } from "../models/result.model";
import { ValidatorInterceptor } from "src/interceptors/validator.interceptor";
import { CreateCustomerContract } from "../contracts/customer/create-customer.contract";
import { CreateCustomerDto } from "../dtos/customer/create-customer.dto";
import { AccountService } from "../services/account.service";
import { User } from "../models/user.model";
import { CustomerService } from "../services/customer.service";
import { Customer } from "../models/customer.model";
import { QueryDto } from "../dtos/query.dto";
import { ListCustomerContract } from "../contracts/customer/list-customer.contract";
import { UpdateCustomerDto } from "../dtos/customer/update-customer.dto";
import { UpdateCustomerContract } from "../contracts/customer/update-customer.contract";
import { CreateCreditCardContract } from "../contracts/customer/create-credit-card.contract";
import { CreditCard } from "../models/creditcard.model";

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
            user = await this.accountService.create(new User(model.document, model.password, ['user'], true));
            customer = new Customer(model.name, model.document, model.email, [], null, null, null, user);
            const res = await this.customerService.create(customer);
            return new Result('Cliente criado com sucesso', true, res, null);
        } catch (error) {
            // Rollback manual
            //this.accountService.remove(user.id);
            throw new HttpException(new Result('Nao foi possível realizar o cadastro', false, null, error), HttpStatus.BAD_REQUEST);
        }
    }

    @Post('credit-cards/:document')
    @UseInterceptors(new ValidatorInterceptor(new CreateCreditCardContract()))
    async createCreditCard(@Param('document') document, @Body() model: CreditCard) {
        try {
            await this.customerService.saveOrUpdateCreditCard(document, model);
            return new Result(null, true, model, null);
        } catch (error) {
            throw new HttpException(new Result('Não foi possível adicionar seu cartão de crédito', false, null, error), HttpStatus.BAD_REQUEST);
        }
    }

    @Put(':document')
    @UseInterceptors(new ValidatorInterceptor(new UpdateCustomerContract()))
    async update(@Param('document') document, @Body() model: UpdateCustomerDto) {
        try {
            await this.customerService.update(document, model);
            return new Result(null, true, model, null);
        } catch (error) {
            throw new HttpException(new Result('Não foi possível atualizar seus dados', false, null, error), HttpStatus.BAD_REQUEST);
        }
    }
    @Delete(':document')
    delete(@Param('document') document) {
        return new Result('Cliente excluído com sucesso', true, null, null);
    }
}