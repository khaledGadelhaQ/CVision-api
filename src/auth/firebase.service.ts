import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class FirebaseService {
  private app: admin.app.App;

  constructor(private configService: ConfigService) {
    this.initializeFirebase();
  }

  private initializeFirebase() {
    try {
      // Try to load from firebase.json file first
      const firebaseConfigPath = path.join(process.cwd(), 'firebase.json');
      
      if (fs.existsSync(firebaseConfigPath)) {
        console.log('🔥 Loading Firebase configuration from firebase.json');
        
        this.app = admin.initializeApp({
          credential: admin.credential.cert(firebaseConfigPath),
        });
        
        console.log('🔥 Firebase Admin initialized successfully from JSON file');
        return;
      }

      // Fallback to environment variables
      const projectId = this.configService.get<string>('firebase.projectId');
      const clientEmail = this.configService.get<string>('firebase.clientEmail');
      const privateKey = this.configService.get<string>('firebase.privateKey');

      if (!projectId || !clientEmail || !privateKey) {
        console.warn('⚠️ Firebase configuration missing - authentication will not work');
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
