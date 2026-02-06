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
import { RoleGuard } from "../guards/role.guard";
import { Roles } from "../decorators/roles.decorator";

@Controller("loans")
@UseGuards(JwtAuthGuard)
export class LoanController {
  constructor(private loanService: LoanService) {}

  @Get()
  @UseGuards(RoleGuard)
  @Roles('admin', 'superAdmin', 'staff')
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
  @UseGuards(RoleGuard)
  @Roles('admin', 'superAdmin', 'staff')
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
  @UseGuards(RoleGuard)
  @Roles('admin', 'superAdmin', 'staff')
  async getExpiredLoans(@Req() req): Promise<LoanDto[]> {
    return this.loanService.getExpiredLoans(req.user.role);
  }

  @Delete(":loanId/delete")
  @UseGuards(RoleGuard)
  @Roles('superAdmin')
  async deleteLoan(
    @Param("loanId") loanId: string,
    @Req() req,
  ): Promise<{ message: string }> {
    return this.loanService.deleteLoan(loanId, req.user.role);
  }
}
