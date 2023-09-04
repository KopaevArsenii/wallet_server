import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository:Repository<Transaction>
  ) {}


  async create(createTransactionDto: CreateTransactionDto, id: number) {
    const newTransaction = { 
      title: createTransactionDto.title,
      amount: createTransactionDto.amount,
      type: createTransactionDto.type, 
      category: { id: +createTransactionDto.category },
      user: { id }
    }

    if (!newTransaction) throw new BadRequestException("Wrong input");
    return await this.transactionRepository.save(newTransaction);
  }

  async findAll(id:number) {
    const transactions = await this.transactionRepository.find({ 
      where: { 
        user: { id } 
      },
      order: {
        createdAt: 'DESC'
      }
    });
    return transactions;
  }

  async findOne(id: number) {
    const transaction = await this.transactionRepository.find({
      where: {
        id
      },
      relations: {
        user: true, 
        category: true
      }
    })

    if (transaction.length === 0) throw new NotFoundException("Transaction not found");
    return transaction;
  }

  async update(id: number, updateTransactionDto: UpdateTransactionDto) {
    const transaction = await this.transactionRepository.findOne({
      where: { id }
    })
    if (!transaction) throw new NotFoundException('Transaction not found');
    return this.transactionRepository.update(id, updateTransactionDto)
  }

  async remove(id: number) {
    const transaction = await this.transactionRepository.findOne({
      where: { id }
    })
    if (!transaction) throw new NotFoundException('Transaction not found');

    return this.transactionRepository.delete(id)
  }

  async findAllWithPagination(id:number, page: number, limit: number) {
    const transactions = await this.transactionRepository.find({
      where: {
        user: { id }
      }, 
      relations: {
        user: true,
        category: true
      },
      order: {
        createdAt: "DESC"
      },
      take: limit,
      skip: (page - 1) * limit
    })

    return transactions;
  }

  async findAllByType(id: number, type: string) {
    const transactions = await this.transactionRepository.find({
      where: {
        user: { id },
        type,
      }
    })

    const total = transactions.reduce((acc, obj) => acc + obj.amount, 0)
    return total
  }
}
