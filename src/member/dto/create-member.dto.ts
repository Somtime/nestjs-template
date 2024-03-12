import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateMemberDto {
  @IsOptional()
  branchIdx: number;

  @IsOptional()
  roleIdx: number;

  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  password: string;

  @IsOptional()
  name: string;

  @IsOptional()
  phone: string;
}
