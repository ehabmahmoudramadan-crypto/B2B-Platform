import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { UserStatus } from '../common/enums';

@ApiTags('Admin')
@ApiBearerAuth()
@Roles('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get admin dashboard stats' })
  async getDashboard() {
    return this.adminService.getDashboard();
  }

  @Get('users')
  @ApiOperation({ summary: 'Get all users' })
  async getUsers(
    @Query('role') role?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.adminService.getUsers(role, page, limit);
  }

  @Put('users/:id/status')
  @ApiOperation({ summary: 'Update user status' })
  async updateUserStatus(
    @Param('id') id: string,
    @Body() body: { status: UserStatus },
  ) {
    return this.adminService.updateUserStatus(id, body.status);
  }

  @Get('orders')
  @ApiOperation({ summary: 'Get all orders' })
  async getOrders(
    @Query('status') status?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.adminService.getOrders(status, page, limit);
  }

  @Post('categories')
  @ApiOperation({ summary: 'Create category' })
  async createCategory(@Body() dto: { name: string; description?: string; image?: string; parentId?: string }) {
    return this.adminService.createCategory(dto);
  }

  @Post('brands')
  @ApiOperation({ summary: 'Create brand' })
  async createBrand(@Body() dto: { name: string; logo?: string }) {
    return this.adminService.createBrand(dto);
  }

  @Post('cities')
  @ApiOperation({ summary: 'Create city' })
  async createCity(@Body() dto: { name: string; nameAr?: string; countryCode: string; latitude?: number; longitude?: number }) {
    return this.adminService.createCity(dto);
  }

  @Get('disputes')
  @ApiOperation({ summary: 'Get all disputes' })
  async getDisputes(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.adminService.getDisputes(page, limit);
  }

  @Put('disputes/:id/resolve')
  @ApiOperation({ summary: 'Resolve a dispute' })
  async resolveDispute(@Param('id') id: string, @Body() body: { resolution: string }) {
    return this.adminService.resolveDispute(id, body.resolution);
  }

  @Post('notifications/send')
  @ApiOperation({ summary: 'Send notification to users' })
  async sendNotification(
    @Body() body: { title: string; body: string; role?: string },
  ) {
    return this.adminService.sendNotificationToAll(body.title, body.body, body.role);
  }

  @Get('audit-logs')
  @ApiOperation({ summary: 'Get audit logs' })
  async getAuditLogs(@Query('page') page = 1, @Query('limit') limit = 50) {
    return this.adminService.getAuditLogs(page, limit);
  }
}
