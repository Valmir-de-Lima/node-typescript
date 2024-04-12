import { Injectable, NestInterceptor, ExecutionContext, HttpException, HttpStatus, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { Result } from 'src/modules/backoffice/models/result.model';

@Injectable()
export class RoleInterceptor implements NestInterceptor {
    constructor(public roles: string[]) {

    }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const user: JwtPayload = context.switchToHttp().getRequest().user;

        const hasRole = user.roles.some(role => this.roles.includes(role));

        if (!hasRole) {
            throw new HttpException(
                new Result('Acesso não autorizado', false, null, null),
                HttpStatus.FORBIDDEN);
        }

        return next.handle();
    }
}