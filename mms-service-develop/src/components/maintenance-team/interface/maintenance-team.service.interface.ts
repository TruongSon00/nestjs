import { GetListMaintenaceTeamRequestDto } from '@components/maintenance-team/dto/request/get-list-maintenace-team.request.dto';
import { UpdateMaintenanceTeamRequestDto } from '@components/maintenance-team/dto/request/update-maintenance-team.request.dto';
import { ResponsePayload } from '@utils/response-payload';
import { GetDetailSupplyResponseDto } from '@components/supply/dto/response/get-detail-supply.response.dto';
import { GetListAllMaintenanceTeamAndUserRequestDto } from '@components/maintenance-team/dto/request/get-list-all-maintenance-team-and-user.request.dto';
import { GetDetailMaintenanceTeamResponseDto } from '@components/maintenance-team/dto/response/get-detail-maintenance-team.response.dto';
import { DetailMaintenanceTeamRequestDto } from '../dto/request/detail-maintenance-team.request.dto';
import { DeleteMaintenanceTeamRequestDto } from '../dto/request/delete-maintenance-team.request.dto';
import { UpdateUnitActiveStatusPayload } from '@components/unit/dto/request/update-unit-status.request';

export interface MaintenanceTeamServiceInterface {
  create(payload: any): Promise<any>;
  getList(
    request: GetListMaintenaceTeamRequestDto,
  ): Promise<ResponsePayload<GetDetailSupplyResponseDto | any>>;
  detail(request: DetailMaintenanceTeamRequestDto): Promise<any>;
  update(request: UpdateMaintenanceTeamRequestDto): Promise<any>;
  delete(request: DeleteMaintenanceTeamRequestDto): Promise<any>;
  findOneByCode(code: string): Promise<any>;
  getListAllUserAndAllMaintenanceTeam(
    request: GetListAllMaintenanceTeamAndUserRequestDto,
  ): Promise<any>;
  findOneByCondition(
    condition: any,
  ): Promise<ResponsePayload<GetDetailMaintenanceTeamResponseDto>>;
  createMany(request: any): Promise<{ dataSuccess: any[]; dataError: any[] }>;
  updateStatus(request: UpdateUnitActiveStatusPayload): Promise<any>;
}
