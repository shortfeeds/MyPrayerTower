import { Controller, Get, Post, Param, Query } from '@nestjs/common';
import { SyncService } from './sync.service';

@Controller('admin/sync')
export class SyncController {
    constructor(private syncService: SyncService) { }

    @Post('run')
    async runSync() {
        return this.syncService.runSync('manual');
    }

    @Get('history')
    async getSyncHistory(@Query('limit') limit?: string) {
        return this.syncService.getSyncHistory(limit ? parseInt(limit) : 20);
    }

    @Get(':id')
    async getSyncStatus(@Param('id') id: string) {
        return this.syncService.getSyncStatus(id);
    }
}
