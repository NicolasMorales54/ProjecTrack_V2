import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';

import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('by-project/:projectId')
  findByProjectId(@Param('projectId') projectId: string) {
    return this.usersService.findByProjectId(+projectId);
  }

  @Get('by-role/:role')
  findByRole(@Param('role') role: string) {
    return this.usersService.findByRole(role);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Get(':id/hashed-password')
  async getHashedPassword(@Param('id') id: string) {
    return this.usersService.getHashedPassword(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Patch(':id/role')
  updateRole(@Param('id') id: string, @Body() body: { rol: string }) {
    return this.usersService.updateRole(+id, body.rol);
  }

  @Patch(':id/password')
  async updatePassword(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.usersService.updatePassword(+id, updatePasswordDto);
  }

  @Patch('by-email/:email/password')
  async updatePasswordByEmail(
    @Param('email') email: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.usersService.updatePasswordByEmail(email, updatePasswordDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
