import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService {
  private app: admin.app.App;

  constructor(private configService: ConfigService) {
    this.initializeFirebase();
  }

  private initializeFirebase() {
    try {
      // Load Firebase configuration from environment variables
      const projectId = this.configService.get<string>('firebase.projectId');
      const clientEmail = this.configService.get<string>('firebase.clientEmail');
      const privateKey = this.configService.get<string>('firebase.privateKey');

      if (!projectId || !clientEmail || !privateKey) {
        console.warn('⚠️ Firebase configuration missing - authentication will not work');
        console.warn('Required: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY');
        return;
      }

      this.app = admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
      
      console.log('🔥 Firebase Admin initialized successfully from environment variables');
    } catch (error) {
      console.error('❌ Failed to initialize Firebase Admin:', error);
    }
  }

  async verifyIdToken(idToken: string): Promise<admin.auth.DecodedIdToken> {
    try {
      if (!this.app) {
        throw new UnauthorizedException('Firebase not initialized');
      }

      const decodedToken = await admin.auth().verifyIdToken(idToken);
      return decodedToken;
    } catch (error) {
      console.error('Firebase token verification failed:', error);
      throw new UnauthorizedException('Invalid authentication token');
    }
  }

  async getUserByUid(uid: string): Promise<admin.auth.UserRecord> {
    try {
      if (!this.app) {
        throw new UnauthorizedException('Firebase not initialized');
      }

      return await admin.auth().getUser(uid);
    } catch (error) {
      console.error('Failed to get user from Firebase:', error);
      throw new UnauthorizedException('User not found');
    }
  }

  async createCustomToken(uid: string, additionalClaims?: object): Promise<string> {
    try {
      if (!this.app) {
        throw new UnauthorizedException('Firebase not initialized');
      }

      return await admin.auth().createCustomToken(uid, additionalClaims);
    } catch (error) {
      console.error('Failed to create custom token:', error);
      throw new UnauthorizedException('Failed to create token');
    }
  }
}
