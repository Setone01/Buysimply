import { Controller, Post, Request, Body, UseGuards } from '@nestjs/common';
import { StaffService } from '../services/staff.service';
import { LoginDto } from '../dto/login.dto';
import { LoginResponseDto } from '../dto/login-response.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('auth')
export class StaffController {
  constructor(private staffService: StaffService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    const user = await this.staffService.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    return this.staffService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(): Promise<{ message: string }> {
    return this.staffService.logout();
  }
}