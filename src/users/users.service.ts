import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createUserDto: CreateUserDto) {
    const user = await this.prisma.user.findFirst({
      where: { email: createUserDto.email }
    });

    if (user) throw new HttpException('Email já existe', HttpStatus.BAD_REQUEST);

    return await this.prisma.user.create({
      data: { ...createUserDto }
    });
  }

  async findAll() {
    const users = await this.prisma.user.findMany();
    return {
      message: 'Lista de usuários da aplicação',
      data: users
    };
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id }
    })

    if (!user) throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);

    return {
      message: 'Usuário encontrado',
      data: user
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { id }
    });

    if (!user) throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { ...updateUserDto }
    });

    return {
      message: 'Usuário atualizado com sucesso',
      data: updatedUser
    };
  }

  async remove(id: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id }
      });

      if (!user) throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);

      await this.prisma.user.delete({
        where: { id }
      });

      return { message: 'Usuário removido com sucesso' };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
      }

      // Para outros erros, podemos lançar uma exceção genérica
      throw new HttpException('Erro ao remover usuário', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
