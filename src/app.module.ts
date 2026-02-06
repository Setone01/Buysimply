import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { StaffController } from './controllers/staff.controller';
import { LoanController } from './controllers/loan.controller';
import { StaffService } from './services/staff.service';
import { LoanService } from './services/loan.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './guards/jwt.strategy';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ThrottlerModule.forRoot([{
      ttl: 60000, // Time window in milliseconds
      limit: 10, // Maximum number of requests within the time window
    }]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default_secret',
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '1h' },
    }),
  ],
  controllers: [StaffController, LoanController],
  providers: [
    StaffService,
    LoanService,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}