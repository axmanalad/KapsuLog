import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { PrismaClient } from '@prisma';
import { PrismaPg } from '@prisma/adapter-pg'
import { env } from '@prisma/config'


const adapter = new PrismaPg({
  connectionString: env('DATABASE_URL')
});
const prisma = new PrismaClient({ adapter });

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as { email: string; password: string };
    const result = await AuthService.login(email, password);
    
    if (!result) {
      return res.status(401).json({ success: false, data: { message: 'Invalid credentials' }});
    }
    if (!result.success) {
      return res.json({ success: false, data: { message: result.message }});
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: result.user.id,
          email: result.user.email,
          username: result.user.username
        },
        token: result.token
      }
    });
  } catch {
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, username, password } = req.body as { email: string; username: string; password: string };
    const result = await AuthService.register(email, username, password);

    if (!result) {
      return res.status(401).json({ success: false, data: { message: 'Invalid credentials' }});
    }

    if (!result.success) {
      return res.json({ success: false, data: { message: result.message }});
    }

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: result.user.id,
          email: result.user.email,
          username: result.user.username
        },
        token: result.token
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, username: true }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, data: user });
  } catch (err) {
    console.error('Get current user error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};