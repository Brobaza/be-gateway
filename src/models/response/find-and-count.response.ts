import { ApiProperty } from '@nestjs/swagger';

export class FindAndCountResponse<M> {
  @ApiProperty({
    type: 'array',
  })
  items: M[];

  @ApiProperty({ example: 10 })
  total: number;
}
