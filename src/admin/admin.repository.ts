import { Injectable } from '@nestjs/common';
import { db, DrizzleTransaction } from '@/db';
import { CreateAdmin } from './dto/admin.dto';
import { admins } from '@/db/schema';

@Injectable()
export class AdminRepository {
  constructor() {}
  async findAll() {
    return await db.query.admins.findMany();
  }
  async create(payload: CreateAdmin, tx?: DrizzleTransaction) {
    {
      const client = tx ? tx : db;
      const [result] = await client
        .insert(admins)
        .values({
          username: payload.username,
          auth_id: payload.auth_id,
        })
        .returning();
      return result;
    }
  }
}
