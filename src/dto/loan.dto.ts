import { IsDateString, IsEmail, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export enum LoanStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  EXPIRED = 'expired'
}

export interface Applicant {
  name: string;
  email: string;
  telephone: string;
  totalLoan: string;
}

export class LoanDto {
  @IsString()
  id: string;

  @IsString()
  amount: string;

  @IsDateString()
  maturityDate: string;

  @IsEnum(LoanStatus)
  status: LoanStatus;

  @IsString()
  createdAt: string;

  applicant: Applicant;
}