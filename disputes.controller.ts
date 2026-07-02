import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DisputesService } from './disputes.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Disputes')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('disputes')
export class DisputesController {
  constructor(private disputesService: DisputesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a dispute' })
  async create(
    @CurrentUser() user: any,
    @Body() dto: { orderId: string; subject: string; description: string; attachments?: string[] },
  ) {
    return this.disputesService.create({
      ...dto,
      raisedById: user.id,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get my disputes' })
  async getMyDisputes(@CurrentUser() user: any) {
    return this.disputesService.findByUser(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get dispute by ID' })
  async findOne(@Param('id') id: string) {
    return this.disputesService.findOne(id);
  }
}
