import { DefectSchema } from 'src/models/defect/defect.schema';
import { DefectRepository } from 'src/repository/defect/defect.repository';
import { AttributeTypeRepository } from './../../repository/attribute-type/attribute-type.repository';
import { AttributeTypeSchema } from './../../models/attribute-type/attribute-type.schema';
import { MaintenanceAttributeRepository } from './../../repository/maintenance-attribute/maintenance-attribute.repository';
import { MaintenanceAttributeSchema } from './../../models/maintenance-attribute/maintenance-attribute.schema';
import { SupplyGroupSchema } from 'src/models/supply-group/supply-group.schema';
import { SupplyGroupRepository } from './../../repository/supply-group/supply-group.repository';
import { SupplySchema } from './../../models/supply/supply.schema';
import { SupplyRepository } from './../../repository/supply/supply.repository';
import { UserService } from '@components/user/user.service';
import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChecklistTemplateSchema } from 'src/models/checklist-template/checklist-template.schema';
import { DeviceGroupSchema } from 'src/models/device-group/device-group.schema';
import { InstallationTemplateSchema } from 'src/models/installation-template/installation-template.schema';
import { DeviceSchema } from 'src/models/device/device.schema';
import { MaintenanceTeamSchema } from 'src/models/maintenance-team/maintenance-team.schema';
import { CheckListTemplateRepository } from 'src/repository/checklist-template/checklist-template.repository';
import { DeviceGroupRepository } from 'src/repository/device-group/device-group.repository';
import { InstallationTemplateRepository } from 'src/repository/installation-template/installation-template.repository';
import { DeviceRepository } from 'src/repository/device/device.repository';
import { MaintenanceTeamRepository } from 'src/repository/maintenance-team/maintenance-team.repository';
import { ExportController } from './export.controller';
import { ExportService } from './export.service';
import { UnitRepository } from 'src/repository/unit/unit.repository';
import { UnitSchema } from 'src/models/unit/unit.schema';
import { InterRegionRepository } from 'src/repository/inter-region/inter-region.repository';
import { InterRegionSchema } from 'src/models/inter-region/inter-region.schema';
import { RegionRepository } from 'src/repository/region/region.repository';
import { RegionSchema } from 'src/models/region/region.schema';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'DeviceGroup', schema: DeviceGroupSchema },
      { name: 'MaintenanceTeam', schema: MaintenanceTeamSchema },
      { name: 'Defect', schema: DefectSchema },
      { name: 'CheckListTemplate', schema: ChecklistTemplateSchema },
      { name: 'InstallationTemplate', schema: InstallationTemplateSchema },
      { name: 'AttributeType', schema: AttributeTypeSchema },
      { name: 'MaintenanceAttribute', schema: MaintenanceAttributeSchema },
      { name: 'SupplyGroup', schema: SupplyGroupSchema },
      { name: 'Supply', schema: SupplySchema },
      { name: 'Device', schema: DeviceSchema },
      { name: 'UnitModel', schema: UnitSchema },
      { name: 'InterRegionModel', schema: InterRegionSchema },
      { name: 'RegionModel', schema: RegionSchema },
    ]),
  ],
  providers: [
    {
      provide: 'ExportServiceInterface',
      useClass: ExportService,
    },
    {
      provide: 'UserServiceInterface',
      useClass: UserService,
    },
    {
      provide: 'DeviceGroupRepositoryInterface',
      useClass: DeviceGroupRepository,
    },
    {
      provide: 'MaintenanceTeamRepositoryInterface',
      useClass: MaintenanceTeamRepository,
    },
    {
      provide: 'DefectRepositoryInterface',
      useClass: DefectRepository,
    },
    {
      provide: 'CheckListTemplateRepositoryInterface',
      useClass: CheckListTemplateRepository,
    },
    {
      provide: 'InstallationTemplateRepositoryInterface',
      useClass: InstallationTemplateRepository,
    },
    {
      provide: 'AttributeTypeRepositoryInterface',
      useClass: AttributeTypeRepository,
    },
    {
      provide: 'MaintenanceAttributeRepositoryInterface',
      useClass: MaintenanceAttributeRepository,
    },
    {
      provide: 'SupplyGroupRepositoryInterface',
      useClass: SupplyGroupRepository,
    },
    {
      provide: 'SupplyRepositoryInterface',
      useClass: SupplyRepository,
    },
    {
      provide: 'DeviceRepositoryInterface',
      useClass: DeviceRepository,
    },
    {
      provide: 'UnitRepositoryInterface',
      useClass: UnitRepository,
    },
    {
      provide: 'InterRegionRepositoryInterface',
      useClass: InterRegionRepository,
    },
    {
      provide: 'RegionRepositoryInterface',
      useClass: RegionRepository,
    },
  ],
  controllers: [ExportController],
  exports: [
    {
      provide: 'ExportServiceInterface',
      useClass: ExportService,
    },
    {
      provide: 'UserServiceInterface',
      useClass: UserService,
    },
  ],
})
export class ExportModule {}
