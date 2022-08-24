import { MongooseModule } from '@nestjs/mongoose';
import { MaintenanceTeamSchema } from '../../models/maintenance-team/maintenance-team.schema';
import { forwardRef, Module } from '@nestjs/common';
import { MaintenanceTeamController } from '@components/maintenance-team/maintenance-team.controller';
import { MaintenanceTeamRepository } from '../../repository/maintenance-team/maintenance-team.repository';
import { MaintenanceTeamService } from '@components/maintenance-team/maintenance-team.service';
import { UserModule } from '@components/user/user.module';
import { HistoryModule } from '@components/history/history.module';
import { SupplySchema } from '../../models/supply/supply.schema';
import { SupplyGroupSchema } from '../../models/supply-group/supply-group.schema';
import { SupplyRepository } from '../../repository/supply/supply.repository';
import { SupplyGroupRepository } from '../../repository/supply-group/supply-group.repository';
import { DeviceGroupSchema } from '../../models/device-group/device-group.schema';
import { DeviceGroupRepository } from '../../repository/device-group/device-group.repository';
import { DeviceSchema } from '../../models/device/device.schema';
import { DeviceRepository } from '../../repository/device/device.repository';
import { SupplyModule } from '@components/supply/supply.module';
import { SupplyGroupModule } from '@components/supply-group/supply-group.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'MaintenanceTeam', schema: MaintenanceTeamSchema },
      { name: 'Supply', schema: SupplySchema },
      { name: 'SupplyGroup', schema: SupplyGroupSchema },
      { name: 'DeviceGroup', schema: DeviceGroupSchema },
      { name: 'Device', schema: DeviceSchema },
    ]),
    UserModule,
    HistoryModule,
    forwardRef(() => SupplyModule),
    forwardRef(() => SupplyGroupModule),
  ],
  controllers: [MaintenanceTeamController],
  providers: [
    {
      provide: 'MaintenanceTeamRepositoryInterface',
      useClass: MaintenanceTeamRepository,
    },
    {
      provide: 'MaintenanceTeamServiceInterface',
      useClass: MaintenanceTeamService,
    },
    {
      provide: 'SupplyRepositoryInterface',
      useClass: SupplyRepository,
    },
    {
      provide: 'SupplyGroupRepositoryInterface',
      useClass: SupplyGroupRepository,
    },
    {
      provide: 'DeviceGroupRepositoryInterface',
      useClass: DeviceGroupRepository,
    },
    {
      provide: 'DeviceRepositoryInterface',
      useClass: DeviceRepository,
    },
  ],
  exports: [
    {
      provide: 'MaintenanceTeamServiceInterface',
      useClass: MaintenanceTeamService,
    },
    {
      provide: 'MaintenanceTeamRepositoryInterface',
      useClass: MaintenanceTeamRepository,
    },
  ],
})
export class MaintenanceTeamModule {}
