import {
  Controller,
  Get,
  Param,
  Query,
  Delete,
  UseGuards,
  Req,
} from "@nestjs/common";
import { LoanService } from "../services/loan.service";
import { LoanDto, LoanStatus } from "../dto/loan.dto";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";

@Controller("loans")
@UseGuards(JwtAuthGuard)
export class LoanController {
  constructor(private loanService: LoanService) {}

  @Get()
  async getAllLoans(
    @Query("status") status: LoanStatus,
    @Req() req,
  ): Promise<LoanDto[]> {
    if (status) {
      return this.loanService.getLoansByStatus(status, req.user.role);
    }
    return this.loanService.getAllLoans(req.user.role);
  }

  @Get(":userEmail/get")
  async getLoansByUser(
    @Param("userEmail") userEmail: string,
    @Req() req,
  ): Promise<{ loans: LoanDto[] }> {
    const loans = await this.loanService.getLoansByUser(
      userEmail,
      req.user.role,
    );
    return { loans };
  }

  @Get("expired")
  async getExpiredLoans(@Req() req): Promise<LoanDto[]> {
    return this.loanService.getExpiredLoans(req.user.role);
  }

  @Delete(":loanId/delete")
  async deleteLoan(
    @Param("loanId") loanId: string,
    @Req() req,
  ): Promise<{ message: string }> {
    return this.loanService.deleteLoan(loanId, req.user.role);
  }
}
