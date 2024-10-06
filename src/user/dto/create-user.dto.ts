import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  password: string;

  @IsOptional()
  name: string;

  @IsOptional()
  phone: string;
}
