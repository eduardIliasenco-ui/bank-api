import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserDTO } from './dto/user.dto';
import { IUser } from './types';
import { UserService } from './user.service';

@ApiTags('User (+auth)')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('create')
    async create(@Body() body: UserDTO): Promise<Partial<IUser>> {
        return this.userService.create(body);
    }

    @Post('login')
    async login(@Body() userCredentials: UserDTO): Promise<any> {
        const user = await this.userService.validateUser(userCredentials);

        return await this.userService.generateToken(user);
    }
}
