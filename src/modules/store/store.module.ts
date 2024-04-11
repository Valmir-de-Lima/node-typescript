import { Module } from '@nestjs/common';
import { ProductController } from './controllers/product.controller';
import { ProductService } from './services/product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { OrderService } from './services/order.service';
import { OrderItemService } from './services/order-item.service';
import { OrderController } from './controllers/order.controller';

@Module({
    imports: [TypeOrmModule.forFeature([
        Product,
        Order,
        OrderItem
    ])],
    providers: [
        ProductService,
        OrderService,
        OrderItemService
    ],
    controllers: [
        ProductController,
        OrderController
    ],
})
export class StoreModule { }
