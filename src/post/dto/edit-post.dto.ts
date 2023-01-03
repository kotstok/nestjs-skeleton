import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class EditPostDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @MaxLength(250)
  title?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  content?: string;

  @IsBoolean()
  @IsOptional()
  published?: boolean;
}
