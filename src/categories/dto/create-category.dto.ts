import { IsOptional, IsString } from 'class-validator';

/**
 * DTO for creating a category.
 */
export class CreateCategoryDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}