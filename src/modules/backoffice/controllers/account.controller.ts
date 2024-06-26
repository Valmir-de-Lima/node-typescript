import { Controller, UseGuards, Post, HttpStatus, Body, HttpException, Req } from "@nestjs/common";
import { JwtAuthGuard } from "src/shared/guards/auth.guard";
import { AuthService } from "src/shared/services/auth.service";
import { AuthenticateDto } from "../dtos/account/autenticate.dto";
import { AccountService } from "../services/account.service";
import { Result } from "../models/result.model";
import { ResetPasswordDto } from "../dtos/account/reset-password.dto";
import { ChangePasswordDto } from "../dtos/account/change-password.dto";
import { Guid } from "guid-typescript";
import { Md5 } from "md5-typescript";

@Controller('v1/accounts')
export class AccountController {
    constructor(
        private accountService: AccountService,
        private authService: AuthService
    ) {

    }

    // Autenticar - localhost:3000/v1/accounts/authenticate
    @Post('authenticate')
    async authenticate(@Body() model: AuthenticateDto): Promise<any> {
        const customer = await this.accountService.authenticate(model.username, model.password);
        // Caso não encontre o usuário
        if (!customer)
            throw new HttpException(new Result('Usuário ou senha inválidos', false, null, null), HttpStatus.UNAUTHORIZED);

        // Caso o usuário esteja inativo
        if (!customer.user.active)
            throw new HttpException(new Result('Usuário inativo', false, null, null), HttpStatus.UNAUTHORIZED);

        // Gera o token
        const token = await this.authService.createToken(customer.document, customer.email, '', customer.user.roles);
        return new Result('Autenticação realizada com sucesso', true, token, null);
    }

    // Resetar a senha
    @Post('reset-password')
    async resetPassword(@Body() model: ResetPasswordDto): Promise<any> {
        try {
            // TODO: Enviar E-mail com a senha

            const guid = Guid.create().toString().substring(0, 8).replace('-', '');
            const password = await Md5.init(`${guid}${process.env.SALT_KEY}`);
            await this.accountService.update(model.document, { password: password });
            return new Result('Uma nova senha foi enviada para seu E-mail', true, null, null);
        } catch (error) {
            throw new HttpException(new Result('Não foi possível restaurar sua senha', false, null, error), HttpStatus.BAD_REQUEST);
        }
    }

    // Alterar Senha
    @Post('change-password')
    @UseGuards(JwtAuthGuard)
    async changePassword(@Req() request, @Body() model: ChangePasswordDto): Promise<any> {
        try {
            const password = await Md5.init(`${model.newPassword}${process.env.SALT_KEY}`);
            await this.accountService.update(request.user.document, { password: password });
            return new Result('Sua senha foi alterada com sucesso!', true, null, null);
        } catch (error) {
            throw new HttpException(new Result('Não foi possível alterar sua senha', false, null, error), HttpStatus.BAD_REQUEST);
        }
    }

    // Refresh Token
    @Post('refresh')
    @UseGuards(JwtAuthGuard)
    async refreshToken(@Req() request): Promise<any> {
        // Gera o token
        const token = await this.authService.createToken(request.user.document, request.user.email, request.user.image, request.user.roles);
        return new Result(null, true, token, null);
    }


}