import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FirebaseService } from './firebase.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(
    private firebaseService: FirebaseService,
    private prismaService: PrismaService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if route is marked as public
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is required');
    }

    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      throw new UnauthorizedException('Bearer token is required');
    }

    try {
      // Verify Firebase ID token
      const decodedToken = await this.firebaseService.verifyIdToken(token);
      
      // Get or create user in database
      const user = await this.getOrCreateUser(decodedToken);
      
      // Attach user to request
      request.user = user;
      request.firebaseUser = decodedToken;
      
      return true;
    } catch (error) {
      console.error('Authentication failed:', error);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private async getOrCreateUser(decodedToken: any) {
    const { uid, email, name, picture, phone_number, email_verified } = decodedToken;

    // Try to find existing user
    let user = await this.prismaService.user.findUnique({
      where: { firebaseUid: uid }
    });

    if (!user) {
      // Create new user
      user = await this.prismaService.user.create({
        data: {
          firebaseUid: uid,
          email: email || '',
          // Use firstName from Firebase name if available
          firstName: name || '',
          profileImage: picture,
        }
      });
      
      console.log(`✅ New user created: ${user.email} (${user.id})`);
    } else {
      // Update user record (simplified - just timestamp will update automatically)
      user = await this.prismaService.user.update({
        where: { id: user.id },
        data: { updatedAt: new Date() }
      });
    }

    return user;
  }
}
