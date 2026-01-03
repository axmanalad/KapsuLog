import jwt from 'jsonwebtoken';
// import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma';
import { PrismaPg } from '@prisma/adapter-pg'
import { env } from '@prisma/config'


const adapter = new PrismaPg({
  connectionString: env('DATABASE_URL')
});
const prisma = new PrismaClient({ adapter });
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export class AuthService {
  static async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email }});
    if (!user) return { success: false, message: 'Email is not registered.' };
    // Implement password logic later. Keep using test sample instead.
    // const isPasswordValid = await bcrypt.compare(password, user.password);
    // if (!isPasswordValid) return null;
    const isPasswordValid = password === user.password; // Temporary for testing
    if (!isPasswordValid) return { success: false, message: 'Invalid password.' };
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    return { success: true, user, token };
  }

  static async register(email: string, username: string, password: string) {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return { success: false, message: 'This email is already registered.'};
    // Implement password logic later. Keep using test sample instead.
    // const hashedPassword = await bcrypt.hash(password, 10);
    // if (!hashedPassword) throw new Error('Failed to hash password');
    const user = await prisma.user.create({
      data: { email, username, password }
    });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    return { success: true, user, token };
  }

  static validateToken(token: string) {
    try {
      return jwt.verify(token, JWT_SECRET) as { userId: string };
    } catch {
      return null;
    }
  }
}