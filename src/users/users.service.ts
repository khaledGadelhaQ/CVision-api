import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        skills: {
          include: {
            skill: true,
          },
        },
        roadmaps: {
          where: { status: 'ACTIVE' },
          take: 1,
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: {
            cvs: true,
            roadmaps: true,
            skills: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateProfile(userId: string, updateData: UpdateProfileDto): Promise<User> {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...updateData,
        updatedAt: new Date(),
      },
    });

    return user;
  }

  async getOnboardingSteps(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        firstName: true,
        lastName: true,
        university: true,
        major: true,
        careerGoals: true,
        cvs: { take: 1 },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      profileCompleted: !!(user.firstName && user.lastName),
      academicInfoCompleted: !!(user.university && user.major),
      careerGoalsSet: !!user.careerGoals,
      cvUploaded: user.cvs.length > 0,
    };
  }

  async completeOnboarding(userId: string): Promise<User> {
    const steps = await this.getOnboardingSteps(userId);
    
    // Check if all required steps are completed
    const allStepsCompleted = Object.values(steps).every(step => step === true);
    
    if (!allStepsCompleted) {
      throw new Error('Cannot complete onboarding - not all steps are finished');
    }

    return await this.prisma.user.update({
      where: { id: userId },
      data: {
        onboardingCompleted: true,
        updatedAt: new Date(),
      },
    });
  }

  async getUserStats(userId: string) {
    const stats = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            cvs: true,
            skills: true,
            roadmaps: true,
          },
        },
      },
    });

    if (!stats) {
      throw new NotFoundException('User not found');
    }

    // Calculate days since joining
    const daysSinceJoining = Math.floor(
      (new Date().getTime() - new Date(stats.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    );

    return {
      cvs: stats._count.cvs,
      skills: stats._count.skills,
      roadmaps: stats._count.roadmaps,
      daysSinceJoining,
      lastUpdated: stats.updatedAt,
    };
  }
}
