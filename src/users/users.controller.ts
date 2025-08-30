import { Controller, Get, Put, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { CurrentUser } from '../common/decorators/user.decorator';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { User } from '@prisma/client';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  async getProfile(@CurrentUser() user: User) {
    return await this.usersService.getProfile(user.id);
  }

  @Put('profile')
  async updateProfile(
    @CurrentUser() user: User,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return await this.usersService.updateProfile(user.id, updateProfileDto);
  }

  @Get('onboarding-status')
  async getOnboardingStatus(@CurrentUser() user: User) {
    return {
      completed: user.onboardingCompleted,
      steps: await this.usersService.getOnboardingSteps(user.id),
    };
  }

  @Put('complete-onboarding')
  async completeOnboarding(@CurrentUser() user: User) {
    return await this.usersService.completeOnboarding(user.id);
  }
}
