import { Body, Controller, Post, HttpCode } from '@nestjs/common';
import { ApiTags, ApiUnauthorizedResponse, ApiDefaultResponse, ApiOkResponse } from '@nestjs/swagger';
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
    @HttpCode(200)
    @ApiOkResponse()
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    async login(@Body() userCredentials: UserDTO): Promise<any> {
        const user = await this.userService.validateUser(userCredentials);

        return {
            user,
            token: await this.userService.generateToken(user),
        };
    }
}
