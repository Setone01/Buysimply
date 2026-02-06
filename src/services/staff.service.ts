import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Staff } from '../dto/staff.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class StaffService {
  private staffData: Staff[] = [];

  constructor(private jwtService: JwtService) {
    this.loadStaffData();
  }

  private loadStaffData() {
    try {
      const dataPath = path.join(__dirname, '../../data/staffs.json');
      const rawData = fs.readFileSync(dataPath, 'utf8');
      this.staffData = JSON.parse(rawData);
    } catch (error) {
      console.error('Error loading staff data:', error);
      this.staffData = [];
    }
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = this.staffData.find(u => u.email === email && u.password === pass);
    if (user) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, role: user.role };
    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        email: user.email,
        role: user.role,
      },
    };
  }

  async logout() {
    // In a real application, you might add the token to a blacklist
    return { message: 'Logged out successfully' };
  }
}