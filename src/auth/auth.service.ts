import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as argon2 from "argon2"
import { JwtService } from '@nestjs/jwt';
import { IUser } from './types';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findOne(email);
    const isPasswordValid = await argon2.verify(user.password, pass)
    if (user && isPasswordValid) {
      return user
    }
    return new UnauthorizedException("User or password incorrect")
  }

  async login(user: IUser) {
    const { id, email } = user;
    return {
      id, email, token: this.jwtService.sign({ id, email })
    }
  }
}
