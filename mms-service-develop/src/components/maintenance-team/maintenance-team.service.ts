import { MaintenanceTeamServiceInterface } from '@components/maintenance-team/interface/maintenance-team.service.interface';
import { MaintenanceTeamRepositoryInterface } from '@components/maintenance-team/interface/maintenance-team.repository.interface';
import { Inject, Injectable } from '@nestjs/common';
import { keyBy, has, groupBy } from 'lodash';
import { ResponseCodeEnum } from '@constant/response-code.enum';
import { ResponseBuilder } from '@utils/response-builder';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { plainToInstance } from 'class-transformer';
import { CreateMaintenanceTeamRequestDto } from '@components/maintenance-team/dto/request/create-maintenance-team.request.dto';
import { CreateMaintenanceTeamResponseDto } from '@components/maintenance-team/dto/response/create-maintenance-team.response.dto';
import { UserServiceInterface } from '@components/user/interface/user.service.interface';
import { GetDetailMaintenanceTeamResponseDto } from '@components/maintenance-team/dto/response/get-detail-maintenance-team.response.dto';
import { PagingResponse } from '@utils/paging.response';
import { UpdateMaintenanceTeamRequestDto } from '@components/maintenance-team/dto/request/update-maintenance-team.request.dto';
import { HistoryActionEnum } from '@components/history/history.constant';
import { UpdateMaintenanceTeamResponseDto } from '@components/maintenance-team/dto/response/update-maintenance-team.response.dto';
import { HistoryServiceInterface } from '@components/history/interface/history.service.interface';
import { GetAllMaintenanceTeamAndUserResponseDto } from '@components/maintenance-team/dto/response/get-all-maintenance-team-and-user.response.dto';
import { GetListMaintenaceTeamRequestDto } from '@components/maintenance-team/dto/request/get-list-maintenace-team.request.dto';
import { SupplyRepositoryInterface } from '@components/supply/interface/supply.repository.interface';
import { SupplyGroupRepositoryInterface } from '@components/supply-group/interface/supply-group.repository.interface';
import { DeviceGroupRepositoryInterface } from '@components/device-group/interface/device-group.repository.interface';
import { GetListAllMaintenanceTeamAndUserRequestDto } from '@components/maintenance-team/dto/request/get-list-all-maintenance-team-and-user.request.dto';
import { ResponsibleSubjectType } from '@components/device/device.constant';
import { DeviceRepositoryInterface } from '@components/device/interface/device.repository.interface';
import { isEmpty } from 'lodash';
import { ResponsePayload } from '@utils/response-payload';
import { DEPARTMENT_PERMISSION_SETTING } from '@utils/permissions/department-permission-setting';
import { USER_ROLE_SETTING_NAME } from '@utils/permissions/user-role-setting';
import { MaintenanceTeamMemberRoleConstant } from './maintenance-team.constant';
import { IS_GET_ALL } from '@constant/common';
import { DetailMaintenanceTeamRequestDto } from './dto/request/detail-maintenance-team.request.dto';
import { DeleteMaintenanceTeamRequestDto } from './dto/request/delete-maintenance-team.request.dto';
import { UpdateUnitActiveStatusPayload } from '@components/unit/dto/request/update-unit-status.request';

@Injectable()
export class MaintenanceTeamService implements MaintenanceTeamServiceInterface {
  constructor(
    @Inject('MaintenanceTeamRepositoryInterface')
    private readonly maintenanceTeamRepository: MaintenanceTeamRepositoryInterface,

    @Inject('UserServiceInterface')
    private readonly userService: UserServiceInterface,

    @Inject('HistoryServiceInterface')
    private readonly historyService: HistoryServiceInterface,

    @Inject('SupplyRepositoryInterface')
    private readonly supplyRepository: SupplyRepositoryInterface,

    @Inject('SupplyGroupRepositoryInterface')
    private readonly supplyGroupRepository: SupplyGroupRepositoryInterface,

    @Inject('DeviceGroupRepositoryInterface')
    private readonly deviceGroupRepository: DeviceGroupRepositoryInterface,

    @Inject('DeviceRepositoryInterface')
    private readonly deviceRepository: DeviceRepositoryInterface,

    private readonly i18n: I18nRequestScopeService,
  ) {}

  async create(request: CreateMaintenanceTeamRequestDto): Promise<any> {
    try {
      const { code, name, description, members } = request;
      const existedCode = await this.maintenanceTeamRepository.findOneByCode(
        code,
      );
      if (existedCode) {
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.BAD_REQUEST)
          .withMessage(await this.i18n.translate('error.CODE_ALREADY_EXISTS'))
          .build();
      }
      const roleMember = members.find(
        (member) => member.role === MaintenanceTeamMemberRoleConstant.LEADER,
      );

      if (isEmpty(roleMember)) {
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.BAD_REQUEST)
          .withMessage(
            await this.i18n.translate('error.MAINTENANCE_TEAM_MEMBER_ROLE'),
          )
          .build();
      }

      const maintenanceTeamDocument =
        this.maintenanceTeamRepository.createDocument({
          code,
          name,
          description,
          members,
        });
      const maintenanceTeam = await this.maintenanceTeamRepository.create(
        maintenanceTeamDocument,
      );
      const response = await maintenanceTeam.save();
      const result = plainToInstance(
        CreateMaintenanceTeamResponseDto,
        response,
        {
          excludeExtraneousValues: true,
        },
      );

      return new ResponseBuilder(result)
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('success.SUCCESS'))
        .build();
    } catch (err) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.CAN_NOT_CREATE'))
        .build();
    }
  }
  async getListAllUserAndAllMaintenanceTeam(
    request: GetListAllMaintenanceTeamAndUserRequestDto,
  ): Promise<any> {
    let isFullPermission = false;
    let isIT = false;
    let isITLeader = false;
    if (request.isGetAll === IS_GET_ALL.NO) {
      for (let i = 0; i < request.user.departmentSettings.length; i++) {
        const department = request.user.departmentSettings[i];
        if (DEPARTMENT_PERMISSION_SETTING.ADMIN === department.id)
          isFullPermission = true;
        else if (DEPARTMENT_PERMISSION_SETTING.IT === department.id) {
          isIT = true;
        }
      }
      if (isIT)
        for (let i = 0; i < request.user.userRoleSettings.length; i++) {
          const role = request.user.userRoleSettings[i];
          if (role.name === USER_ROLE_SETTING_NAME.LEADER) isITLeader = true;
        }
    }

    let condition: any = {
      isDeleted: false,
    };

    if (
      request.isGetAll === IS_GET_ALL.NO &&
      isIT &&
      !isITLeader &&
      !isFullPermission
    ) {
      condition = {
        isDeleted: false,
        'members.userId': request.user.id,
        'members.role': MaintenanceTeamMemberRoleConstant.LEADER,
      };
    }

    let userIds = [];
    const userList = await this.userService.getUserListByDepartment();
    const maintenanceTeam =
      await this.maintenanceTeamRepository.findAllByCondition(condition);
    if (maintenanceTeam) {
      userList.responsibleMaintenanceTeams = maintenanceTeam;
      if (
        request.isGetAll === IS_GET_ALL.NO &&
        isIT &&
        !isITLeader &&
        !isFullPermission
      )
        userIds = maintenanceTeam
          .map((e) => e.members.map((v) => v.userId))
          .flat();
      for (const item of userList.responsibleMaintenanceTeams) {
        item.type = ResponsibleSubjectType.MaintenanceTeam;
      }
    } else {
      userList.responsibleMaintenanceTeams = '';
    }

    const users = await this.userService.getListByIDs(userIds);
    if (
      request.isGetAll === IS_GET_ALL.NO &&
      isIT &&
      !isITLeader &&
      !isFullPermission
    ) {
      for (const item of users) {
        item.type = ResponsibleSubjectType.User;
      }
      userList.responsibleUsers = users;
    } else if (userList) {
      for (const item of userList.data) {
        item.type = ResponsibleSubjectType.User;
      }
      userList.responsibleUsers = userList.data;
    } else {
      userList.responsibleUsers = null;
    }

    const response = plainToInstance(
      GetAllMaintenanceTeamAndUserResponseDto,
      userList,
      {
        excludeExtraneousValues: true,
      },
    );
    return new ResponseBuilder(response)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('success.SUCCESS'))
      .build();
  }

  async getList(request: GetListMaintenaceTeamRequestDto): Promise<any> {
    const { result, count } = await this.maintenanceTeamRepository.getList(
      request,
    );
    const response = plainToInstance(
      GetDetailMaintenanceTeamResponseDto,
      result,
      {
        excludeExtraneousValues: true,
      },
    );
    return new ResponseBuilder<PagingResponse>({
      items: response,
      meta: { total: count, page: request.page },
    })
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('success.SUCCESS'))
      .build();
  }

  async findOneByCode(code: string): Promise<any> {
    const response = await this.maintenanceTeamRepository.findOneByCode(code);
    if (!response) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .build();
    }
    return new ResponseBuilder().withCode(ResponseCodeEnum.SUCCESS).build();
  }

  async delete(request: DeleteMaintenanceTeamRequestDto) {
    const { id } = request;
    const maintainTeam = await this.maintenanceTeamRepository.findOneById(id);
    if (!maintainTeam) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .build();
    }
    const supplyMaintenanceTeam =
      await this.supplyRepository.findMaintenanceTeam(id);
    if (supplyMaintenanceTeam) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.MAINTENANCE_TEAM_USED'))
        .build();
    }
    const deviceGroupMaintenanceTeam =
      await this.deviceGroupRepository.findMaintenanceTeam(id);
    if (deviceGroupMaintenanceTeam) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.MAINTENANCE_TEAM_USED'))
        .build();
    }
    const deviceMaintenanceTeam =
      await this.deviceRepository.findMaintenanceTeam(id);
    if (deviceMaintenanceTeam) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.MAINTENANCE_TEAM_USED'))
        .build();
    }
    await this.maintenanceTeamRepository.findByIdAndUpdate(id, {
      isDeleted: true,
    });
    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('success.SUCCESS'))
      .build();
  }

  async detail(request: DetailMaintenanceTeamRequestDto): Promise<any> {
    const { id } = request;
    const response = await this.maintenanceTeamRepository.detail(id);
    if (!response) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .build();
    }
    await this.historyService.mapUserHistory(response.histories);
    await this.historyService.mapUserHistory(response.members);
    await this.historyService.sortHistoryDesc(response.histories);
    const result = plainToInstance(
      GetDetailMaintenanceTeamResponseDto,
      response,
      {
        excludeExtraneousValues: true,
      },
    );
    return new ResponseBuilder(result)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('success.SUCCESS'))
      .build();
  }
  async update(request: UpdateMaintenanceTeamRequestDto): Promise<any> {
    const { _id, userId, name, members } = request;
    const nameInput = name ? name.trim() : null;
    if (isEmpty(nameInput)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.MISSING_REQUIRED_FIELDS'))
        .build();
    }
    const maintenanceTeam = await this.maintenanceTeamRepository.detail(_id);
    if (!maintenanceTeam) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .build();
    }
    const roleMember = [];
    for (const item of members) {
      if (item.role == MaintenanceTeamMemberRoleConstant.LEADER) {
        if (!roleMember.includes(item.role)) {
          roleMember.push(item.role);
        } else {
          return new ResponseBuilder()
            .withCode(ResponseCodeEnum.BAD_REQUEST)
            .withMessage(
              await this.i18n.translate('error.MAINTENANCE_TEAM_MEMBER_ROLE'),
            )
            .build();
        }
      }
    }
    try {
      if (!isEmpty(roleMember)) {
        // update maintenanceTeam
        await this.maintenanceTeamRepository.update({
          ...request,
          history: {
            userId: userId,
            action: HistoryActionEnum.UPDATE,
            createdAt: new Date(),
          },
        });
        const response = await this.maintenanceTeamRepository.detail(_id);
        if (!response) {
          return new ResponseBuilder()
            .withCode(ResponseCodeEnum.BAD_REQUEST)
            .withMessage(await this.i18n.translate('error.NOT_FOUND'))
            .build();
        }
        const result = plainToInstance(
          UpdateMaintenanceTeamResponseDto,
          response,
          { excludeExtraneousValues: true },
        );
        return new ResponseBuilder(result)
          .withCode(ResponseCodeEnum.SUCCESS)
          .withMessage(await this.i18n.translate('success.SUCCESS'))
          .build();
      } else {
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.BAD_REQUEST)
          .withMessage(
            await this.i18n.translate('error.MAINTENANCE_TEAM_MEMBER_ROLE'),
          )
          .build();
      }
    } catch (err) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.CAN_NOT_UPDATE'))
        .build();
    }
  }

  async findOneByCondition(
    condition: any,
  ): Promise<ResponsePayload<GetDetailMaintenanceTeamResponseDto>> {
    const maintenanceTeam =
      await this.maintenanceTeamRepository.findOneByCondition(condition);

    const result = plainToInstance(
      GetDetailMaintenanceTeamResponseDto,
      maintenanceTeam,
      { excludeExtraneousValues: true },
    );

    return new ResponseBuilder<GetDetailMaintenanceTeamResponseDto>()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData(result)
      .build();
  }

  async createMany(
    data: any,
  ): Promise<{ dataSuccess: any[]; dataError: any[] }> {
    const dataToInsert = [];
    const dataToUpdate = [];
    const codesInsert = [];
    const codesUpdate = [];
    const textAdd = await this.i18n.translate('import.common.add');

    const convertData = [];
    const maintenanceTeams = groupBy(data, 'code');
    for (const key in maintenanceTeams) {
      const arrMember = maintenanceTeams[key].map((i) => ({
        userId: i.member,
        role: i.role,
      }));
      convertData.push({
        ...maintenanceTeams[key],
        members: arrMember,
      });
    }

    convertData.forEach((item) => {
      if (item.action === textAdd) {
        dataToInsert.push(item);
        codesInsert.push(item.code);
      } else {
        dataToUpdate.push(item);
        codesUpdate.push(item.code);
      }
    });

    const codeInsertExists =
      await this.maintenanceTeamRepository.findAllByCondition({
        code: { $in: codesInsert },
      });
    const codeUpdateExists =
      await this.maintenanceTeamRepository.findAllByCondition({
        code: { $in: codesUpdate },
      });
    const insertMap = keyBy(codeInsertExists, 'code');
    const updateMap = keyBy(codeUpdateExists, 'code');

    const dataError = [];
    const dataInsert = [];
    const dataUpdate = [];
    dataToInsert.forEach((item) => {
      if (has(insertMap, item.code)) {
        dataError.push(item);
      } else {
        dataInsert.push(item);
      }
    });
    dataToUpdate.forEach((item) => {
      if (!has(updateMap, item.code)) {
        dataError.push(item);
      } else {
        dataUpdate.push(item);
      }
    });

    const bulkOps = [...dataInsert, ...codeUpdateExists].map((doc) => ({
      updateOne: {
        filter: {
          code: doc.code,
        },
      },
      update: doc,
      upsert: true,
    }));

    const dataSuccess = await this.maintenanceTeamRepository.import(bulkOps);

    return {
      dataError,
      dataSuccess,
    };
  }

  async updateStatus(request: UpdateUnitActiveStatusPayload): Promise<any> {
    const { id, status } = request;
    const maintenaceTeam = await this.maintenanceTeamRepository.findOneById(id);
    if (!maintenaceTeam) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage(await this.i18n.translate('error.NOT_FOUND'));
    }
    maintenaceTeam.active = status;
    await maintenaceTeam.save();
    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('error.SUCCESS'));
  }
}
