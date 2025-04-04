import { ApiProperty } from '@nestjs/swagger';

export class BaseModelDto {
  @ApiProperty()
  id: string;
  @ApiProperty({ type: String, format: 'date-time', nullable: true })
  updated_at: Date | null;
  @ApiProperty({ type: String, format: 'date-time' })
  created_at: Date;
  @ApiProperty({ type: String, format: 'date-time' })
  deleted_at: Date | null;
}

export class ApiResponse<TData> {
  data: TData;
}
