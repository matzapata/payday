import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@src/database/prisma.service';

@Injectable()
export class UsersRepository {
  constructor(private prisma: PrismaService) {}

  async createUser(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({ data });
  }

  async findOrCreate(data: Prisma.UserCreateInput) {
    return this.prisma.user.upsert({
      where: { email: data.email },
      update: data,
      create: data,
    });
  }

  async findUserById(id: string, include?: Prisma.UserInclude) {
    return this.prisma.user.findUnique({
      where: { id },
      include,
    });
  }

  async findUserByEmail(email: string, include?: Prisma.UserInclude) {
    return this.prisma.user.findUnique({
      where: { email },
      include,
    });
  }
}
