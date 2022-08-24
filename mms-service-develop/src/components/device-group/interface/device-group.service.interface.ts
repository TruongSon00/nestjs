import { UpdateDeviceGroupRequestDto } from '@components/device-group/dto/request/update-device-group.request.dto';
import { GetListDeviceGroupRequestDto } from '@components/device-group/dto/request/get-list-device-group.request.dto';
import { ConfirmDeviceGroupRequestDto } from '@components/device-group/dto/request/confirm-device-group.request.dto';
import { ExportDeviceGroupRequestDto } from '@components/device-group/dto/request/export-device-group.request.dto';
import { ImportBaseInterface } from '@components/import/interface/import.base.interface';
import { ImportDeviceGroupResultDto } from '@components/device-group/dto/response/import-device-group-result.dto';
import { DetailDeviceGroupRequestDto } from '../dto/request/detail-device-group.request.dto';
import { DeleteDeviceGroupRequestDto } from '../dto/request/delete-device-group.request.dto';

export interface DeviceGroupServiceInterface
  extends ImportBaseInterface<ImportDeviceGroupResultDto> {
  getList(request: GetListDeviceGroupRequestDto): Promise<any>;
  create(payload: any): Promise<any>;
  detail(request: DetailDeviceGroupRequestDto): Promise<any>;
  update(request: UpdateDeviceGroupRequestDto): Promise<any>;
  findOneByCode(code: string): Promise<any>;
  delete(request: DeleteDeviceGroupRequestDto): Promise<any>;
  confirm(request: ConfirmDeviceGroupRequestDto): Promise<any>;
  exportDeviceGroup(request: ExportDeviceGroupRequestDto): Promise<any>;
  createMany(
    request: any,
    userId: number,
  ): Promise<{ dataSuccess: any[]; dataError: any[] }>;
}
