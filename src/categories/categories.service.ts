import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

/**
 * Service for category operations.
 */
@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category) private readonly categoriesRepository: Repository<Category>,
  ) { }

  /**
   * Creates a new category.
   * @param dto - The category data transfer object.
   * @returns The created category.
   */
  async create(dto: CreateCategoryDto): Promise<Category> {
    const category = this.categoriesRepository.create(dto);
    return this.categoriesRepository.save(category);
  }

  /**
   * Returns all categories.
   * @returns An array of categories.
   */
  async findAll(): Promise<Category[]> {
    return this.categoriesRepository.find();
  }

  /**
   * Returns a category by ID.
   * @param id - The ID of the category.
   * @returns The category with the specified ID.
   */
  async findOne(id: string): Promise<Category | null> {
    return this.categoriesRepository.findOne({ where: { id } });
  }

  /**
   * Updates a category by ID.
   * @param id - The ID of the category to update.
   * @param dto - The category data transfer object.
   * @returns The updated category.
   */
  async update(id: string, dto: UpdateCategoryDto): Promise<Category> {
    await this.categoriesRepository.update(id, dto);
    return this.findOne(id) as Promise<Category>;
  }

  /**
   * Removes a category by ID.
   * @param id - The ID of the category to remove.
   */
  async remove(id: string): Promise<void> {
    await this.categoriesRepository.delete(id);
  }
}