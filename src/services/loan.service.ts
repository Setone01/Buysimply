import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { LoanDto, LoanStatus } from '../dto/loan.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LoanService {
  private originalLoans: LoanDto[] = [];
  private deletedLoanIds: Set<string> = new Set();

  constructor() {
    this.loadLoansData();
  }

  private loadLoansData() {
    try {
      const dataPath = path.join(__dirname, '../../data/loans.json');
      const rawData = fs.readFileSync(dataPath, 'utf8');
      this.originalLoans = JSON.parse(rawData);
    } catch (error) {
      console.error('Error loading loans data:', error);
      this.originalLoans = [];
    }
  }

  private getActiveLoans(): LoanDto[] {
    return this.originalLoans.filter(loan => !this.deletedLoanIds.has(loan.id));
  }

  async getAllLoans(userRole: string): Promise<LoanDto[]> {
    const activeLoans = this.getActiveLoans();
    if (userRole === 'admin' || userRole === 'superAdmin') {
      // Admins and superadmins can see all loans with totalLoan
      return activeLoans;
    } else {
      // Regular staff can see all loans but without totalLoan
      return activeLoans.map(loan => {
        const loanWithoutTotal = JSON.parse(JSON.stringify(loan));
        if (loanWithoutTotal.applicant && loanWithoutTotal.applicant.totalLoan) {
          delete loanWithoutTotal.applicant.totalLoan;
        }
        return loanWithoutTotal;
      });
    }
  }

  async getLoansByStatus(status: LoanStatus, userRole: string): Promise<LoanDto[]> {
    const activeLoans = this.getActiveLoans();
    const filteredLoans = activeLoans.filter(loan => loan.status === status);

    if (userRole === 'admin' || userRole === 'superAdmin') {
      return filteredLoans;
    } else {
      // Regular staff can see loans but without totalLoan
      return filteredLoans.map(loan => {
        const loanWithoutTotal = JSON.parse(JSON.stringify(loan)); 
        if (loanWithoutTotal.applicant && loanWithoutTotal.applicant.totalLoan) {
          delete loanWithoutTotal.applicant.totalLoan;
        }
        return loanWithoutTotal;
      });
    }
  }

  async getLoansByUser(userEmail: string, userRole: string): Promise<LoanDto[]> {
    const activeLoans = this.getActiveLoans();
    const userLoans = activeLoans.filter(loan => loan.applicant.email === userEmail);

    if (userRole === 'admin' || userRole === 'superAdmin') {
      return userLoans;
    } else {
      return userLoans.map(loan => {
        const loanWithoutTotal = JSON.parse(JSON.stringify(loan)); 
        if (loanWithoutTotal.applicant && loanWithoutTotal.applicant.totalLoan) {
          delete loanWithoutTotal.applicant.totalLoan;
        }
        return loanWithoutTotal;
      });
    }
  }

  async getExpiredLoans(userRole: string): Promise<LoanDto[]> {
    const currentDate = new Date();
    const activeLoans = this.getActiveLoans();
    const expiredLoans = activeLoans.filter(loan => new Date(loan.maturityDate) < currentDate);

    if (userRole === 'admin' || userRole === 'superAdmin') {
      return expiredLoans;
    } else {
      // Regular staff can see expired loans but without totalLoan
      return expiredLoans.map(loan => {
        const loanWithoutTotal = JSON.parse(JSON.stringify(loan)); // Deep copy to ensure no reference issues
        if (loanWithoutTotal.applicant && loanWithoutTotal.applicant.totalLoan) {
          delete loanWithoutTotal.applicant.totalLoan;
        }
        return loanWithoutTotal;
      });
    }
  }

  async deleteLoan(loanId: string, userRole: string): Promise<{ message: string }> {
    if (userRole !== 'superAdmin') {
      throw new ForbiddenException('Only super admins can delete loans');
    }

    const loanExists = this.originalLoans.some(loan => loan.id === loanId);
    if (!loanExists) {
      throw new NotFoundException('Loan not found');
    }

    // Track the loan as deleted without modifying the original data
    this.deletedLoanIds.add(loanId);

    return { message: 'Loan deleted successfully' };
  }
}