import { Injectable, NestInterceptor, ExecutionContext, HttpException, HttpStatus, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Contract } from 'src/modules/backoffice/contracts/contract';
import { Result } from 'src/modules/backoffice/models/result.model';

@Injectable()
export class ValidatorInterceptor implements NestInterceptor {
    constructor(public contract: Contract) {

    }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const body = context.switchToHttp().getRequest().body;
        const valid = this.contract.validate(body);

        if (!valid) {
            throw new HttpException(new Result('Informação inválida', false, null, this.contract.errors), HttpStatus.BAD_REQUEST);
        }

        return next.handle();
    }
}