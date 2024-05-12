import { MiddlewareConsumer, Module } from '@nestjs/common';
import { CurrentUserMiddleware } from './middlewares/current-user.middleware';
import { UsersService } from './services/users.service';
import { UsersRepository } from './repositories/users.repository';
import { AuthModule } from '@src/infrastructure/auth/auth.module';
import { PrismaModule } from '@src/database/prisma.module';

@Module({
  providers: [UsersService, UsersRepository],
  imports: [PrismaModule, AuthModule],
  controllers: [],
  exports: [UsersService],
})
export class UsersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserMiddleware).forRoutes('*');
  }
}
