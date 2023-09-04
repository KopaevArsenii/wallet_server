import { CanActivate, ExecutionContext, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { Observable } from "rxjs";
import { CategoryService } from "src/category/category.service";
import { TransactionService } from "src/transaction/transaction.service";

@Injectable()
export default class AuthorCuard implements CanActivate {
    constructor(
        private readonly transactionService: TransactionService,
        private readonly categoryService: CategoryService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()
        const { id, type } = request.params

        let entity

        switch (type) {
            case 'transactions':
                entity = await this.transactionService.findOne(id);
                break;
            case 'category':
                entity = await this.categoryService.findOne(id);
                break;
            default:
                throw new NotFoundException('Something went wrong...');
        }

        const user = request.user;

        if (entity && user && entity.user.id === user.id) {
            return true
        }

        throw new ForbiddenException("This content don't belong to user")
    }
}