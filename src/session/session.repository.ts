import { Injectable } from '@nestjs/common';
import { db } from '@/db';
import { sessions } from '@/db/schema';
import { CreateSessionDto } from './dto/create-session.dto';
import { SESSION_EXPIRES_DATE_MS } from '@/config';
import { encodeHexLowerCase } from '@oslojs/encoding';
import { sha256 } from '@oslojs/crypto/sha2';
import { eq } from 'drizzle-orm';

@Injectable()
export class SessionRepository {
  constructor() {}
  async findAll() {
    return await db.query.sessions.findMany();
  }

  async create(payload: CreateSessionDto) {
    const sessionId = encodeHexLowerCase(
      sha256(new TextEncoder().encode(payload.token)),
    );
    const [result] = await db
      .insert(sessions)
      .values({
        id: sessionId,
        auth_id: payload.auth_id,
        expires_at: new Date(Date.now() + SESSION_EXPIRES_DATE_MS),
      })
      .returning({
        expires_at: sessions.expires_at,
      });
    return result;
  }
  async findById(id: string) {
    return await db.query.sessions.findFirst({
      where: eq(sessions.id, id),
      with: {
        auth: {
          with: {
            admin: true,
          },
        },
      },
    });
  }

  async deleteSessionById(sessionId: string) {
    return await db.delete(sessions).where(eq(sessions.id, sessionId));
  }

  async updateSessionExpiredAt(sessionId: string, expiredAt: Date) {
    return await db
      .update(sessions)
      .set({
        expires_at: expiredAt,
      })
      .where(eq(sessions.id, sessionId));
  }

  public async updateSession(id: string, time: number) {
    if (Date.now() >= time) {
      await this.deleteSessionById(id);
      return { session: null, auth: null };
    }
    if (Date.now() >= time - SESSION_EXPIRES_DATE_MS) {
      const extendedTime = new Date(Date.now() + SESSION_EXPIRES_DATE_MS);
      await this.updateSessionExpiredAt(id, extendedTime);
    }
  }
}
