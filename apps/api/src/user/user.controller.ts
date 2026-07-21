import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ZodValidationPipe } from '../zod-validation.pipe';
import {
  ApiCreateUser,
  ApiFindAllUsers,
  ApiFindOneUser,
  ApiUpdateUser,
  ApiDeleteUser,
} from './user.docs';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('users')
@Controller('users')
@UsePipes(new ZodValidationPipe())
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  @ApiCreateUser()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('me')
  @UseGuards(JwtGuard)
  async findMe(@CurrentUser('userId') userId: string) {
    return this.userService.findOne(userId);
  }

  @Get()
  @ApiFindAllUsers()
  async findAll() {
    return this.userService.findAll();
  }

  @Get(':userId')
  @ApiFindOneUser()
  async findOne(@Param('userId') userId: string) {
    return this.userService.findOne(userId);
  }

  @Patch(':userId')
  @ApiUpdateUser()
  async update(
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(userId, updateUserDto);
  }

  @Delete(':userId')
  @ApiDeleteUser()
  async remove(@Param('userId') userId: string) {
    return this.userService.remove(userId);
  }
}
