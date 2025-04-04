import { db, DrizzleTransaction } from '@/db';
import { auths } from '@/db/schema';
import { Signup } from '@/shared/dto/auth.dto';
import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';

@Injectable()
export class AuthRepository {
  constructor() {}
  async findByEmail(email: string) {
    return await db.query.auths.findFirst({
      where: eq(auths.email, email),
      with: {
        admin: true,
      },
    });
  }

  public async create(
    payload: Omit<Signup, 'username'>,
    tx?: DrizzleTransaction,
  ) {
    const client = tx ? tx : db;
    const [result] = await client
      .insert(auths)
      .values({
        email: payload.email,
        password: payload.password,
      })
      .returning();
    return result;
  }
}
