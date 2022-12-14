import { SupplyGroupService } from '@components/supply-group/supply-group.service';
import { MaintenanceAttributeRepository } from './../../repository/maintenance-attribute/maintenance-attribute.repository';
import { MaintenanceAttributeService } from '@components/maintenance-attribute/maintenance-attribute.service';
import { MaintenanceAttributeSchema } from './../../models/maintenance-attribute/maintenance-attribute.schema';
import { DeviceSchema } from './../../models/device/device.schema';
import { DeviceRepository } from './../../repository/device/device.repository';
import { DefectRepository } from './../../repository/defect/defect.repository';
import { DefectService } from './../defect/defect.service';
import { DefectSchema } from './../../models/defect/defect.schema';
import { AttributeTypeSchema } from './../../models/attribute-type/attribute-type.schema';
import { AttributeTypeRepository } from 'src/repository/attribute-type/attribute-type.repository';
import { AttributeTypeService } from './../attribute-type/attribute-type.service';
import { SupplyGroupRepository } from './../../repository/supply-group/supply-group.repository';
import { SupplyRepository } from './../../repository/supply/supply.repository';
import { SupplyService } from './../supply/supply.service';
import { CheckListTemplateService } from './../checklist-template/checklist-template.service';
import { DeviceGroupService } from '@components/device-group/device-group.service';
import { HistoryModule } from '@components/history/history.module';
import { ImportModule } from '@components/import/import.module';
import { UserService } from '@components/user/user.service';
import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DeviceGroupSchema } from 'src/models/device-group/device-group.schema';
import { MaintenanceTeamSchema } from 'src/models/maintenance-team/maintenance-team.schema';
import { SupplyGroupSchema } from 'src/models/supply-group/supply-group.schema';
import { DeviceGroupRepository } from 'src/repository/device-group/device-group.repository';
import { MaintenanceTeamRepository } from 'src/repository/maintenance-team/maintenance-team.repository';
import { ImportExcelController } from './import-excel.controller';
import { ImportExcelService } from './import-excel.service';
import { SupplySchema } from 'src/models/supply/supply.schema';
import { ChecklistTemplateSchema } from 'src/models/checklist-template/checklist-template.schema';
import { CheckListTemplateRepository } from 'src/repository/checklist-template/checklist-template.repository';
import { InstallationTemplateService } from '@components/installation-template/installation-template.service';
import { InstallationTemplateSchema } from 'src/models/installation-template/installation-template.schema';
import { InstallationTemplateRepository } from 'src/repository/installation-template/installation-template.repository';
import { UnitSchema } from 'src/models/unit/unit.schema';
import { UnitRepository } from 'src/repository/unit/unit.repository';
import { UnitService } from '@components/unit/unit.service';
import { InterRegionSchema } from 'src/models/inter-region/inter-region.schema';
import { InterRegionRepository } from 'src/repository/inter-region/inter-region.repository';
import { InterRegionService } from '@components/inter-region/inter-region.service';
import { RegionRepository } from 'src/repository/region/region.repository';
import { RegionSchema } from 'src/models/region/region.schema';
import { RegionService } from '@components/region/region.service';
import { MaintenanceTeamService } from '@components/maintenance-team/maintenance-team.service';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'DeviceGroup', schema: DeviceGroupSchema },
      { name: 'MaintenanceTeam', schema: MaintenanceTeamSchema },
      { name: 'SupplyGroup', schema: SupplyGroupSchema },
      { name: 'MaintenanceAttribute', schema: MaintenanceAttributeSchema },
      { name: 'Defect', schema: DefectSchema },
      { name: 'Device', schema: DeviceSchema },
      { name: 'AttributeType', schema: AttributeTypeSchema },
      { name: 'Supply', schema: SupplySchema },
      { name: 'SupplyGroup', schema: SupplyGroupSchema },
      { name: 'CheckListTemplate', schema: ChecklistTemplateSchema },
      { name: 'Device', schema: DeviceSchema },
      { name: 'InstallationTemplate', schema: InstallationTemplateSchema },
      { name: 'UnitModel', schema: UnitSchema },
      { name: 'InterRegionModel', schema: InterRegionSchema },
      { name: 'RegionModel', schema: RegionSchema },
    ]),
    HistoryModule,
    ImportModule,
  ],
  exports: [
    {
      provide: 'ImportExcelServiceInterface',
      useClass: ImportExcelService,
    },
  ],
  providers: [
    {
      provide: 'ImportExcelServiceInterface',
      useClass: ImportExcelService,
    },
    {
      provide: 'UserServiceInterface',
      useClass: UserService,
    },
    {
      provide: 'SupplyGroupServiceInterface',
      useClass: SupplyGroupService,
    },
    {
      provide: 'SupplyGroupRepositoryInterface',
      useClass: SupplyGroupRepository,
    },
    {
      provide: 'DefectServiceInterface',
      useClass: DefectService,
    },
    {
      provide: 'DefectRepositoryInterface',
      useClass: DefectRepository,
    },
    {
      provide: 'DeviceRepositoryInterface',
      useClass: DeviceRepository,
    },
    {
      provide: 'MaintenanceAttributeServiceInterface',
      useClass: MaintenanceAttributeService,
    },
    {
      provide: 'MaintenanceAttributeRepositoryInterface',
      useClass: MaintenanceAttributeRepository,
    },
    {
      provide: 'AttributeTypeServiceInterface',
      useClass: AttributeTypeService,
    },
    {
      provide: 'AttributeTypeRepositoryInterface',
      useClass: AttributeTypeRepository,
    },
    {
      provide: 'DeviceGroupServiceInterface',
      useClass: DeviceGroupService,
    },
    {
      provide: 'SupplyServiceInterface',
      useClass: SupplyService,
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
    {
      provide: 'CheckListTemplateRepositoryInterface',
      useClass: CheckListTemplateRepository,
    },
    {
      provide: 'CheckListTemplateServiceInterface',
      useClass: CheckListTemplateService,
    },
    {
      provide: 'DeviceRepositoryInterface',
      useClass: DeviceRepository,
    },
    {
      provide: 'CheckListTemplateRepositoryInterface',
      useClass: CheckListTemplateRepository,
    },
    {
      provide: 'CheckListTemplateServiceInterface',
      useClass: CheckListTemplateService,
    },
    {
      provide: 'MaintenanceTeamRepositoryInterface',
      useClass: MaintenanceTeamRepository,
    },
    {
      provide: 'InstallationTemplateServiceInterface',
      useClass: InstallationTemplateService,
    },
    {
      provide: 'InstallationTemplateRepositoryInterface',
      useClass: InstallationTemplateRepository,
    },
    {
      provide: 'UnitRepositoryInterface',
      useClass: UnitRepository,
    },
    {
      provide: 'UnitServiceInterface',
      useClass: UnitService,
    },
    {
      provide: 'InterRegionRepositoryInterface',
      useClass: InterRegionRepository,
    },
    {
      provide: 'InterRegionServiceInterface',
      useClass: InterRegionService,
    },
    {
      provide: 'RegionRepositoryInterface',
      useClass: RegionRepository,
    },
    {
      provide: 'RegionServiceInterface',
      useClass: RegionService,
    },
    {
      provide: 'MaintenanceTeamServiceInterface',
      useClass: MaintenanceTeamService,
    },
  ],
  controllers: [ImportExcelController],
})
export class ImportExcelModule {}
