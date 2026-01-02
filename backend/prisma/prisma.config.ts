import 'dotenv/config'
import type { PrismaConfig } from '@prisma/config';
import { env } from '@prisma/config';

export default {
  datasource: {
    url: env("DATABASE_URL")
  }
} satisfies PrismaConfig;