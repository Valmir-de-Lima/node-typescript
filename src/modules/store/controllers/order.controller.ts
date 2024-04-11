import { Controller, HttpException, HttpStatus, Get, Post, Body, Param } from '@nestjs/common';
import { OrderService } from 'src/modules/store/services/order.service';
import { Order } from 'src/modules/store/entities/order.entity';
import { OrderItemDto } from '../dtos/order-item.dto';
import { OrderItem } from '../entities/order-item.entity';
import { ProductService } from '../services/product.service';
import { OrderItemService } from '../services/order-item.service';
import { Result } from 'src/modules/backoffice/models/result.model';

@Controller('v1/orders')
export class OrderController {
    constructor(
        private readonly orderService: OrderService,
        private readonly orderItemService: OrderItemService,
        private readonly productService: ProductService
    ) { }

    @Get(':order')
    async get(@Param('order') order: string) {
        try {
            const orders = await this.orderService.getByNumber(order);
            return new Result(null, true, orders, null);
        } catch (error) {
            throw new HttpException(new Result('Não foi possível listar os pedidos', false, null, error), HttpStatus.BAD_REQUEST);
        }
    }

    @Get('/customer/:document')
    async getByCustomer(@Param('document') document: string) {
        try {
            const orders = await this.orderService.getByCustomer(document);
            return new Result(null, true, orders, null);
        } catch (error) {
            throw new HttpException(new Result('Não foi possível listar os pedidos', false, null, error), HttpStatus.BAD_REQUEST);
        }
    }

    @Post()
    async post(@Body() model: OrderItemDto[]) {
        try {
            let order = new Order();
            order.customer = '12345678901';
            order.date = new Date();
            order.number = '4A2D3F5';
            order.items = [];
            await this.orderService.post(order);

            for (const item of model) {
                let product = await this.productService.getById(item.product);
                let orderItem = new OrderItem();
                orderItem.order = order;
                orderItem.product = product;
                orderItem.price = product.price;
                orderItem.quantity = item.quantity;
                await this.orderItemService.post(orderItem);
            };

            return new Result(null, true, model, null);
        } catch (error) {
            throw new HttpException(new Result('Não foi possível criar seu pedido', false, null, error), HttpStatus.BAD_REQUEST);
        }
    }
}