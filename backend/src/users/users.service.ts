import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { UsuarioProyecto } from '../projects/entities/usuario-proyecto.entity';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

type SafeUser = Omit<User, 'contrasena'>;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UsuarioProyecto)
    private usuarioProyectoRepository: Repository<UsuarioProyecto>,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(dto.contrasena, saltOrRounds);

    const usuario = this.userRepository.create({
      ...dto,
      contrasena: hashedPassword,
    });

    return this.userRepository.save(usuario);
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) return null;
    const { contrasena, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { correoElectronico: email } });
  }

  async login(
    email: string,
    plainPassword: string,
  ): Promise<Omit<User, 'contrasena'> | null> {
    const user = await this.findByEmail(email);
    if (!user) return null;

    if (!user?.contrasena) return null;
    const passwordMatch = await bcrypt.compare(plainPassword, user.contrasena);

    if (!passwordMatch) return null;

    const { contrasena, ...safeUser } = user;
    return safeUser;
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async findByProjectId(projectId: number) {
    // Find all users assigned to a project via usuarios_proyectos
    const userProjects = await this.usuarioProyectoRepository.find({
      where: { proyectoId: projectId },
      relations: ['usuario'],
    });
    return userProjects.map((up) => {
      const { contrasena, ...user } = up.usuario;
      return user;
    });
  }

  async updatePassword(id: number, dto: UpdatePasswordDto) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new Error('User not found');
    if (!user.contrasena) throw new Error('User has no password set');
    const isMatch = await bcrypt.compare(dto.currentPassword, user.contrasena);
    if (!isMatch) throw new Error('Current password is incorrect');
    const hashed = await bcrypt.hash(dto.newPassword, 10);
    user.contrasena = hashed;
    await this.userRepository.save(user);
    const { contrasena, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async updatePasswordByEmail(email: string, dto: UpdatePasswordDto) {
    const user = await this.userRepository.findOne({
      where: { correoElectronico: email },
    });
    if (!user) throw new Error('User not found');
    if (!user.contrasena) throw new Error('User has no password set');
    const isMatch = await bcrypt.compare(dto.currentPassword, user.contrasena);
    if (!isMatch) throw new Error('Current password is incorrect');
    const hashed = await bcrypt.hash(dto.newPassword, 10);
    user.contrasena = hashed;
    await this.userRepository.save(user);
    const { contrasena, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async getHashedPassword(
    id: number,
  ): Promise<{ hashedPassword: string } | null> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user || !user.contrasena) return null;
    return { hashedPassword: user.contrasena };
  }
}
