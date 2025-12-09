import { IsOptional, IsString } from 'class-validator';

/**
 * DTO for updating a category.
 */
export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;
}