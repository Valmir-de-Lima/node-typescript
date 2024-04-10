import { Flunt } from "src/utils/flunt";
import { Contract } from "../contract";
import { Injectable } from "@nestjs/common";
import { QueryDto } from "../../dtos/query.dto";

@Injectable()
export class ListCustomerContract implements Contract {
    errors: any[];

    validate(model: QueryDto): boolean {
        const flunt = new Flunt();

        if (!model.query)
            model.query = {};

        flunt.isSmallerThan(model.take, 1001, 'Paginação limitada a 1000 registros');

        this.errors = flunt.errors;

        return flunt.isValid();
    }
}