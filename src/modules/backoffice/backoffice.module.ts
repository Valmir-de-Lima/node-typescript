import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomerSchema } from './schemas/customer.schema';
import { UserSchema } from './schemas/user.schema';
import { AccountService } from './services/account.service';
import { CustomerService } from './services/customer.service';
import { CustomerController } from './controllers/customer.controller';
import { AddressService } from './services/address.service';
import { PetService } from './services/pet.service';
import { AddressController } from './controllers/address.controller';
import { PetController } from './controllers/pet.controller';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: 'Customer',
                schema: CustomerSchema
            },
            {
                name: 'User',
                schema: UserSchema
            }
        ])],
    controllers: [
        CustomerController,
        AddressController,
        PetController
    ],
    providers: [
        AccountService,
        CustomerService,
        AddressService,
        PetService
    ]
})
export class BackofficeModule { }
