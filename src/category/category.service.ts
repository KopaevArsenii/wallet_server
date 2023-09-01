import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>
  ) {}

  async create(createCategoryDto: CreateCategoryDto, id:number) {
    const isExist = await this.categoryRepository.findBy({ user: {id}, title: createCategoryDto.title });

    if (isExist.length !== 0) throw new BadRequestException("This category already exist");
    const newCategory = {
      title: createCategoryDto.title,
      user: { id }
    }
    return await this.categoryRepository.save(newCategory);
  }

  async findAll(id: number) {
    return await this.categoryRepository.find({ 
      where: {
        user: { id }
      },
      relations: {
        transactions: true
      }
    })
  }

  async findOne(id: number) {
    const category = await this.categoryRepository.findOne({
      where: { id }, 
      relations: {
        user: true,
        transactions: true
      }
    });

    if(!category) throw new NotFoundException('Category not found');
    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });

    if (!category) throw new NotFoundException('Category not found');
    return await this.categoryRepository.update(id, updateCategoryDto);
  }

  async remove(id: number) {
    const category = await this.categoryRepository.findOne({ where: { id }})
    if (!category) throw new NotFoundException('Category not found')

    return await this.categoryRepository.delete(id)
  }
}
