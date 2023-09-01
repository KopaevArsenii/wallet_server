import { isNotEmpty, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Category } from "src/category/entities/category.entity";
import { User } from "src/user/entities/user.entity";

export class CreateTransactionDto {
    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    @IsNumber()
    amount: number;

    @IsNotEmpty()
    @IsString()
    type: 'expense' | 'income';

    @IsNotEmpty()
    category: Category;
}
