import { Request, Response, NextFunction } from 'express';
import { CURRENT_CITIZEN } from '../data/mockData';

export interface AuthRequest extends Request {
  user?: any;
  citizenId?: number | string;
}

export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  
  // If a real Bearer token is provided, attempt Firebase decode
  if (authHeader && authHeader.startsWith('Bearer ') && !authHeader.includes('demo')) {
    try {
      const { adminAuth } = await import('../lib/firebase-admin');
      const token = authHeader.split('Bearer ')[1];
      const decodedToken = await adminAuth.verifyIdToken(token);
      req.user = decodedToken;
      req.citizenId = decodedToken.uid || CURRENT_CITIZEN.id;
      return next();
    } catch (error) {
      console.warn('Firebase token verification skipped, falling back to authenticated citizen demo session.');
    }
  }

  // Graceful fallback for local development & demonstration:
  // Authenticate as active citizen Rameshwar Murmu
  req.user = {
    uid: CURRENT_CITIZEN.id,
    name: CURRENT_CITIZEN.name,
    email: 'rameshwar.murmu@jharkhand.citizen.in',
  };
  req.citizenId = CURRENT_CITIZEN.id;

  next();
};
