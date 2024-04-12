import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { CacheModule } from '@nestjs/cache-manager';

import { CustomerSchema } from './schemas/customer.schema';
import { UserSchema } from './schemas/user.schema';

import { AccountService } from './services/account.service';
import { CustomerService } from './services/customer.service';
import { AddressService } from './services/address.service';
import { PetService } from './services/pet.service';
import { AuthService } from 'src/shared/services/auth.service';
import { JwtStrategy } from 'src/shared/strategies/jwt.strategy';

import { CustomerController } from './controllers/customer.controller';
import { AddressController } from './controllers/address.controller';
import { PetController } from './controllers/pet.controller';
import { AccountController } from './controllers/account.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [
        HttpModule,
        CacheModule.register(),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            secret: process.env.JWT_KEY,
            signOptions: {
                expiresIn: 3600,
            },
        }),
        MongooseModule.forFeature([
            {
                name: 'Customer',
                schema: CustomerSchema
            },
            {
                name: 'User',
                schema: UserSchema
            }
        ])
    ],
    controllers: [
        CustomerController,
        AddressController,
        PetController,
        AccountController
    ],
    providers: [
        AccountService,
        CustomerService,
        AddressService,
        PetService,
        AuthService,
        JwtStrategy
    ]
})
export class BackofficeModule { }
