import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
    @IsString({ message: 'O nome deve ser uma string' })
    @MinLength(3, { message: 'O nome deve conter pelo menos 3 caracteres' })
    @MaxLength(50, { message: 'O nome deve conter no máximo 50 caracteres' })
    name: string;

    @IsEmail({}, { message: 'Email inválido, tente novamente' })
    email: string;
}
