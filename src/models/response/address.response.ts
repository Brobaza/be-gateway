import { ApiProperty } from '@nestjs/swagger';

export class AddressResponse {
  @ApiProperty({ example: 'eb4e9a1b-3f27-47cb-b650-2e9915cf1703' })
  id: string;

  @ApiProperty({ example: true })
  isDefault: boolean;

  @ApiProperty({ example: 'Home' })
  title: string;

  @ApiProperty({ example: 'John Doe' })
  address: string;

  @ApiProperty({ example: '1234 Main Street' })
  type: string;
}
