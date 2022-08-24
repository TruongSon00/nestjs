import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { DeviceGroupSchema } from '../../models/device-group/device-group.schema';
import { DeviceGroupService } from '@components/device-group/device-group.service';
import { DeviceGroupRepository } from '../../repository/device-group/device-group.repository';
import { DeviceGroupController } from '@components/device-group/device-group.controller';
import { UserModule } from '@components/user/user.module';
import { HistoryModule } from '@components/history/history.module';
import { MaintenanceTeamModule } from '@components/maintenance-team/maintenance-team.module';
import { ImportModule } from '@components/import/import.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'DeviceGroup', schema: DeviceGroupSchema },
    ]),
    UserModule,
    HistoryModule,
    ImportModule,
    MaintenanceTeamModule,
  ],
  controllers: [DeviceGroupController],
  providers: [
    {
      provide: 'DeviceGroupRepositoryInterface',
      useClass: DeviceGroupRepository,
    },
    {
      provide: 'DeviceGroupServiceInterface',
      useClass: DeviceGroupService,
    },
  ],
  exports: [
    MongooseModule,
    {
      provide: 'DeviceGroupRepositoryInterface',
      useClass: DeviceGroupRepository,
    },
    {
      provide: 'DeviceGroupServiceInterface',
      useClass: DeviceGroupService,
    },
  ],
})
export class DeviceGroupModule {}
