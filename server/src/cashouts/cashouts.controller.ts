import { Controller, Get, UseGuards } from '@nestjs/common';
import { CurrentUser } from '@src/users/decorators/current-user.decorator';
import { AuthGuard } from '@src/users/guards/auth.guard';
import { AuthUser } from '@src/users/middlewares/current-user.middleware';

@Controller('cashouts')
export class CashoutsController {
  @Get('/balance')
  @UseGuards(AuthGuard)
  getBalance(@CurrentUser() user: AuthUser) {
    return { user: user };
  }
}
