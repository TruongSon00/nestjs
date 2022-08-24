import { DeviceGroupServiceInterface } from '@components/device-group/interface/device-group.service.interface';
import { DeviceGroupRepositoryInterface } from '@components/device-group/interface/device-group.repository.interface';
import { Inject, Injectable } from '@nestjs/common';
import { ResponseBuilder } from '@utils/response-builder';
import { ResponseCodeEnum } from '@constant/response-code.enum';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { CreateDeviceGroupRequestDto } from '@components/device-group/dto/request/create-device-group.request.dto';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { compact, has, isEmpty, keyBy } from 'lodash';
import { UserServiceInterface } from '@components/user/interface/user.service.interface';
import { UpdateDeviceGroupRequestDto } from '@components/device-group/dto/request/update-device-group.request.dto';
import { GetListDeviceGroupRequestDto } from '@components/device-group/dto/request/get-list-device-group.request.dto';
import { PagingResponse } from '@utils/paging.response';
import { CreateDeviceGroupResponseDto } from '@components/device-group/dto/response/create-device-group.response.dto';
import { plainToInstance } from 'class-transformer';
import { GetDetailDeviceGroupResponseDto } from '@components/device-group/dto/response/get-detail-device-group.response.dto';
import { HistoryActionEnum } from '@components/history/history.constant';
import { ConfirmDeviceGroupRequestDto } from '@components/device-group/dto/request/confirm-device-group.request.dto';
import { ApiError } from '@utils/api.error';
import {
  DEVICE_GROUP_HEADER,
  DEVICE_GROUP_NAME,
  DeviceGroupStatusConstant,
  IMPORT_DEVICE_GROUP_CONST,
  STATUS_TO_DELETE_OR_UPDATE_DEVICE_GROUP,
} from '@components/device-group/device-group.constant';
import { GetAllConstant } from '@components/supply/supply.constant';
import { GetAllDeviceGroup } from '@components/device-group/dto/response/get-all-device-group';
import { HistoryServiceInterface } from '@components/history/interface/history.service.interface';
import { MaintenanceTeamRepositoryInterface } from '@components/maintenance-team/interface/maintenance-team.repository.interface';
import { ResponsibleSubjectType } from '@components/device/device.constant';
import { UpdateDeviceGroupResponseDto } from '@components/device-group/dto/response/update-device-group.response.dto';
import { CsvWriter } from '@core/csv/csv.writer';
import { ExportDeviceGroupRequestDto } from '@components/device-group/dto/request/export-device-group.request.dto';
import { ImportRequestDto } from '@components/import/dto/request/import.request.dto';
import { ResponsePayload } from '@utils/response-payload';
import { ImportResponseDto } from '@components/import/dto/response/import.response.dto';
import { getCellValueByRow } from '@utils/extensions/excel.extension';
import {
  IMPORT_ACTION_CONST,
  IMPORT_ACTION_OPTION,
  IMPORT_HEADER_CONST,
} from '@components/import/import.constant';
import { GetImportTemplateResponseDto } from '@components/import/dto/response/get-import-template.response.dto';
import { ImportServiceInterface } from '@components/import/interface/import.service.interface';
import { ImportDeviceGroupResultDto } from '@components/device-group/dto/response/import-device-group-result.dto';
import { ImportDeviceGroupRowRequestDto } from '@components/device-group/dto/request/import-device-group-row.request.dto';
import { DetailDeviceGroupRequestDto } from './dto/request/detail-device-group.request.dto';
import { DeleteDeviceGroupRequestDto } from './dto/request/delete-device-group.request.dto';

@Injectable()
export class DeviceGroupService implements DeviceGroupServiceInterface {
  constructor(
    @Inject('DeviceGroupRepositoryInterface')
    private readonly deviceGroupRepository: DeviceGroupRepositoryInterface,
    @Inject('UserServiceInterface')
    private readonly userService: UserServiceInterface,
    @Inject('HistoryServiceInterface')
    private readonly historyService: HistoryServiceInterface,
    @Inject('MaintenanceTeamRepositoryInterface')
    private readonly maintenanceTeamRepository: MaintenanceTeamRepositoryInterface,
    @Inject('ImportServiceInterface')
    private readonly importService: ImportServiceInterface,
    @InjectConnection()
    private readonly connection: Connection,
    private readonly i18n: I18nRequestScopeService,
  ) {}

  async create(request: CreateDeviceGroupRequestDto): Promise<any> {
    try {
      const { code, name, responsibleUser, description, userId } = request;
      const codeInput = code ? code.trim() : null;
      const nameInput = name ? name.trim() : null;
      if (isEmpty(codeInput) || isEmpty(nameInput)) {
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.BAD_REQUEST)
          .withMessage(
            await this.i18n.translate('error.MISSING_REQUIRED_FIELDS'),
          )
          .build();
      }
      let responsibleUserIds;
      let responsibleMaintenanceTeam;
      if (responsibleUser.type == ResponsibleSubjectType.User) {
        responsibleUserIds = responsibleUser.id;
        responsibleMaintenanceTeam = null;
      } else if (
        responsibleUser.type == ResponsibleSubjectType.MaintenanceTeam
      ) {
        responsibleMaintenanceTeam = responsibleUser.id;
        responsibleUserIds = null;
      } else {
        responsibleUserIds = null;
        responsibleMaintenanceTeam = null;
      }
      if (responsibleUserIds != null) {
        const userInfo = await this.userService.getUserById(responsibleUserIds);
        if (!userInfo) {
          return new ResponseBuilder()
            .withCode(ResponseCodeEnum.INTERNAL_SERVER_ERROR)
            .withMessage(await this.i18n.translate('error.USER_NOT_FOUND'))
            .build();
        }
      } else if (responsibleMaintenanceTeam != null) {
        const maintenanceTeam = await this.maintenanceTeamRepository.detail(
          responsibleMaintenanceTeam,
        );
        if (!maintenanceTeam) {
          return new ResponseBuilder()
            .withCode(ResponseCodeEnum.INTERNAL_SERVER_ERROR)
            .withMessage(
              await this.i18n.translate('error.MAINTENANCE_TEAM_NOT_FOUND'),
            )
            .build();
        }
      }
      const existedCode = await this.deviceGroupRepository.findOneByCode(code);
      if (!existedCode) {
        const deviceGroupDocument = this.deviceGroupRepository.createDocument({
          code: code,
          name: name,
          status: DeviceGroupStatusConstant.AWAITING,
          responsibleUserIds: responsibleUserIds,
          responsibleMaintenanceTeam: responsibleMaintenanceTeam,
          description: description,
        });
        // create device Group and assign to history
        const deviceGroup = await this.deviceGroupRepository.create(
          deviceGroupDocument,
        );
        deviceGroup.histories.push({
          userId: userId,
          action: HistoryActionEnum.CREATE,
          createdAt: new Date(),
        });
        const response = await deviceGroup.save();
        const result = plainToInstance(CreateDeviceGroupResponseDto, response, {
          excludeExtraneousValues: true,
        });
        return new ResponseBuilder(result)
          .withCode(ResponseCodeEnum.SUCCESS)
          .withMessage(await this.i18n.translate('success.SUCCESS'))
          .build();
      } else {
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.BAD_REQUEST)
          .withMessage(
            await this.i18n.translate('error.DEVICE_GROUP_CODE_INVALID'),
          )
          .build();
      }
    } catch (err) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.CAN_NOT_CREATE'))
        .build();
    }
  }

  async getList(request: GetListDeviceGroupRequestDto): Promise<any> {
    if (parseInt(request.isGetAll) == GetAllConstant.YES) {
      const response =
        await this.deviceGroupRepository.findDeviceGroupConfirmed();
      if (!response) {
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.BAD_REQUEST)
          .withMessage(
            await this.i18n.translate('error.DEVICE_GROUP_NOT_FOUND'),
          )
          .build();
      }
      let responsibleUserInfo;
      for (const e of response) {
        if (e.responsibleMaintenanceTeam) {
          responsibleUserInfo = await this.maintenanceTeamRepository.detail(
            e.responsibleMaintenanceTeam,
          );
          e.responsibleUser = {
            id: responsibleUserInfo._id.toString(),
            name: responsibleUserInfo.name,
            type: ResponsibleSubjectType.MaintenanceTeam,
          };
        } else if (e.responsibleUserIds) {
          responsibleUserInfo = await this.userService.getUserById(
            e.responsibleUserIds,
          );
          e.responsibleUser = {
            id: responsibleUserInfo.id,
            name: responsibleUserInfo.username,
            type: ResponsibleSubjectType.User,
          };
        } else e.responsibleUser = null;
      }
      const result = plainToInstance(GetAllDeviceGroup, response, {
        excludeExtraneousValues: true,
      });
      return new ResponseBuilder(result)
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('success.SUCCESS'))
        .build();
    } else {
      const { result, count } = await this.deviceGroupRepository.getList(
        request,
      );
      const response = plainToInstance(
        GetDetailDeviceGroupResponseDto,
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
  }
  async findOneByCode(code: string): Promise<any> {
    const response = await this.deviceGroupRepository.findOneByCode(code);
    if (!response) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.DEVICE_GROUP_NOT_FOUND'))
        .build();
    }
    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData(response)
      .build();
  }
  async detail(request: DetailDeviceGroupRequestDto): Promise<any> {
    const { id } = request;
    const response = await this.deviceGroupRepository.detail(id);
    if (!response) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.DEVICE_GROUP_NOT_FOUND'))
        .build();
    }
    let responsibleUserInfo;
    await this.historyService.mapUserHistory(response.histories);
    if (response.responsibleMaintenanceTeam) {
      responsibleUserInfo = await this.maintenanceTeamRepository.detail(
        response.responsibleMaintenanceTeam,
      );
      response.responsibleUser = {
        id: responsibleUserInfo._id.toString(),
        name: responsibleUserInfo.name,
        type: ResponsibleSubjectType.MaintenanceTeam,
      };
    } else if (response.responsibleUserIds) {
      responsibleUserInfo = await this.userService.getUserById(
        response.responsibleUserIds,
      );
      response.responsibleUser = {
        id: responsibleUserInfo.id,
        name: responsibleUserInfo.username,
        type: ResponsibleSubjectType.User,
      };
    } else response.responsibleUser = null;
    await this.historyService.sortHistoryDesc(response.histories);
    const result = plainToInstance(GetDetailDeviceGroupResponseDto, response, {
      excludeExtraneousValues: true,
    });
    return new ResponseBuilder(result)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('success.SUCCESS'))
      .build();
  }

  async update(request: UpdateDeviceGroupRequestDto): Promise<any> {
    const { _id, description, userId, name, responsibleUser } = request;
    const nameInput = name ? name.trim() : null;
    if (isEmpty(nameInput)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.MISSING_REQUIRED_FIELDS'))
        .build();
    }
    const deviceGroup = await this.deviceGroupRepository.detail(_id);
    if (!deviceGroup) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.DEVICE_GROUP_NOT_FOUND'))
        .build();
    }
    if (!STATUS_TO_DELETE_OR_UPDATE_DEVICE_GROUP.includes(deviceGroup.status))
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.STATUS_CONFIRM'),
      ).toResponse();
    try {
      // update deviceGroup
      let responsibleUserIds;
      let responsibleMaintenanceTeam;
      if (responsibleUser.type == ResponsibleSubjectType.User) {
        responsibleUserIds = responsibleUser.id;
        responsibleMaintenanceTeam = null;
      } else if (
        responsibleUser.type == ResponsibleSubjectType.MaintenanceTeam
      ) {
        responsibleMaintenanceTeam = responsibleUser.id;
        responsibleUserIds = null;
      } else {
        responsibleUserIds = null;
        responsibleMaintenanceTeam = null;
      }
      const updateResult = await this.deviceGroupRepository.update({
        ...request,
        responsibleUserIds: responsibleUserIds,
        responsibleMaintenanceTeam: responsibleMaintenanceTeam,
        history: {
          userId: userId,
          action: HistoryActionEnum.UPDATE,
          createdAt: new Date(),
        },
      });
      const response = await this.deviceGroupRepository.detail(_id);
      if (!response) {
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.BAD_REQUEST)
          .withMessage(
            await this.i18n.translate('error.DEVICE_GROUP_NOT_FOUND'),
          )
          .build();
      }
      const result = plainToInstance(UpdateDeviceGroupResponseDto, response, {
        excludeExtraneousValues: true,
      });
      return new ResponseBuilder(result)
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('success.SUCCESS'))
        .build();
    } catch (err) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.CAN_NOT_UPDATE'))
        .build();
    }
  }

  async confirm(request: ConfirmDeviceGroupRequestDto): Promise<any> {
    const { _id, userId } = request;
    const deviceGroup = await this.deviceGroupRepository.findOneById(_id);
    if (!deviceGroup) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.DEVICE_GROUP_NOT_FOUND'))
        .build();
    }
    if (!STATUS_TO_DELETE_OR_UPDATE_DEVICE_GROUP.includes(deviceGroup.status))
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.STATUS_CONFIRM'),
      ).toResponse();
    try {
      // update deviceGroup
      const updateResult = await this.deviceGroupRepository.update({
        ...request,
        status: DeviceGroupStatusConstant.CONFIRMED,
        history: {
          userId: userId,
          action: HistoryActionEnum.CONFIRM,
          createdAt: new Date(),
        },
      });
      const response = await this.deviceGroupRepository.detail(_id);
      if (!response) {
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.BAD_REQUEST)
          .withMessage(
            await this.i18n.translate('error.DEVICE_GROUP_NOT_FOUND'),
          )
          .build();
      }
      return new ResponseBuilder(response)
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('success.SUCCESS'))
        .build();
    } catch (err) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.CAN_NOT_UPDATE'))
        .build();
    }
  }

  async delete(request: DeleteDeviceGroupRequestDto) {
    const { id } = request;
    const deviceGroup = await this.deviceGroupRepository.findOneById(id);
    if (!deviceGroup) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.DEVICE_GROUP_NOT_FOUND'))
        .build();
    }
    if (!STATUS_TO_DELETE_OR_UPDATE_DEVICE_GROUP.includes(deviceGroup.status))
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.STATUS_CONFIRM'),
      ).toResponse();
    const result = await this.deviceGroupRepository.delete(id);
    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('success.SUCCESS'))
      .build();
  }
  async exportDeviceGroup(request: ExportDeviceGroupRequestDto): Promise<any> {
    const deviceGroups =
      await this.deviceGroupRepository.getListDeviceGroupByIds(request._ids);
    if (!deviceGroups) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.DEVICE_GROUP_NOT_FOUND'))
        .build();
    }
    let responsibleUsers;
    for (const e of deviceGroups) {
      if (e.responsibleMaintenanceTeam != null) {
        responsibleUsers = await this.maintenanceTeamRepository.detail(
          e.responsibleMaintenanceTeam,
        );
        e.responsibleUser = responsibleUsers.name;
      } else if (e.responsibleUserIds != null) {
        responsibleUsers = await this.userService.getUserById(
          e.responsibleUserIds,
        );
        e.responsibleUser = responsibleUsers.username;
      } else {
        e.responsibleUser = null;
      }
    }
    const responseRef = deviceGroups.reduce((x, y) => {
      x.push({
        _id: y._id ? y._id.toString() : '',
        code: y.code ? y.code : '',
        name: y.name ? y.name : '',
        description: y.description ? y.description : '',
        status: y.status ? y.status : 0,
        createdAt: y.createdAt
          ? y.createdAt.toISOString().replace(/T/, ' ').replace(/\..+/, '')
          : new Date(),
        updatedAt: y.updatedAt
          ? y.updatedAt.toISOString().replace(/T/, ' ').replace(/\..+/, '')
          : new Date(),
        responsibleUser: y.responsibleUser ? y.responsibleUser : '',
      });
      return x;
    }, []);

    const csvWriter = new CsvWriter();
    csvWriter.name = DEVICE_GROUP_NAME;
    csvWriter.mapHeader = DEVICE_GROUP_HEADER;
    csvWriter.i18n = this.i18n;
    let index = 0;
    const dataCsv = responseRef.map((i) => {
      index++;
      return {
        i: index,
        _id: i._id,
        code: i.code,
        name: i.name,
        description: i.description,
        status: i.status,
        createdAt: i.createdAt,
        updatedAt: i.updatedAt,
        responsibleUser: i.responsibleUser,
      };
    });

    return new ResponseBuilder<any>({
      file: await csvWriter.writeCsv(dataCsv),
    })
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('success.SUCCESS'))
      .build();
  }

  async import(
    request: ImportRequestDto,
  ): Promise<ResponsePayload<ImportResponseDto<ImportDeviceGroupResultDto>>> {
    const worksheet = await this.importService.loadXlsx(request);

    const { COLUMNS, ENTITY_KEY, REQUIRED_FIELDS } = IMPORT_DEVICE_GROUP_CONST;
    const { HEADER_ROW_INDEX, DATA_ROW_START } = IMPORT_HEADER_CONST;

    const validateColumnsResponse = await this.importService.validateColumns(
      worksheet,
      COLUMNS,
      ENTITY_KEY,
    );

    if (validateColumnsResponse.statusCode != ResponseCodeEnum.SUCCESS)
      return validateColumnsResponse;

    const availableActions = await this.importService.getAvailableActions();

    // reduce row number by 1 to exclude the header row
    const response = new ImportResponseDto<ImportDeviceGroupResultDto>(
      worksheet.actualRowCount - HEADER_ROW_INDEX,
    );

    const columnMap = validateColumnsResponse.data as Map<string, string>;

    for (let i = DATA_ROW_START; i <= worksheet.actualRowCount; i++) {
      const row = worksheet.getRow(i);
      const action = getCellValueByRow(row, IMPORT_ACTION_CONST.CELL_INDEX);

      if (isEmpty(action)) continue;

      const rowDto = new ImportDeviceGroupRowRequestDto();

      rowDto.action = action;
      this.importService.assignProperty(COLUMNS, row, rowDto);

      const result = plainToInstance(ImportDeviceGroupResultDto, rowDto, {
        excludeExtraneousValues: true,
      });

      await this.importService.validateRowData(
        rowDto,
        columnMap,
        REQUIRED_FIELDS,
        Array.from(availableActions.values()),
        result,
        response,
      );

      if (!result.isSuccess) response.results.push(result);
      else {
        const mapHistoryAndResponsibleSubject = async (
          dto: CreateDeviceGroupRequestDto | UpdateDeviceGroupRequestDto,
        ) => {
          dto.userId = request.historyUserId;

          const { responsibleUser } = rowDto;

          if (!isEmpty(responsibleUser)) {
            const user = (
              await this.userService.getUsersByUsernames([responsibleUser])
            )[0];

            if (user) {
              dto.responsibleUser = {
                id: user.id,
                type: ResponsibleSubjectType.User,
              };
            }
          }
        };

        let addOrUpdateResponse: ResponsePayload<any>;

        const { CREATE, UPDATE } = IMPORT_ACTION_OPTION;

        switch (action) {
          case availableActions.get(CREATE):
            const createDto = plainToInstance(
              CreateDeviceGroupRequestDto,
              rowDto,
              {
                excludeExtraneousValues: true,
              },
            );

            await mapHistoryAndResponsibleSubject(createDto);
            addOrUpdateResponse = await this.create(createDto);
            break;
          case availableActions.get(UPDATE):
            const detailDeviceGroupResponse = await this.findOneByCode(
              rowDto.code,
            );

            if (
              detailDeviceGroupResponse.statusCode != ResponseCodeEnum.SUCCESS
            )
              addOrUpdateResponse = detailDeviceGroupResponse;
            else {
              const updateDto = plainToInstance(
                UpdateDeviceGroupRequestDto,
                rowDto,
                {
                  excludeExtraneousValues: true,
                },
              );

              await mapHistoryAndResponsibleSubject(updateDto);

              addOrUpdateResponse = await this.update(updateDto);
            }
            break;
        }

        if (addOrUpdateResponse.statusCode != ResponseCodeEnum.SUCCESS)
          this.importService.assignRowImportResult(
            result,
            response,
            addOrUpdateResponse.message,
          );
        else {
          this.importService.assignRowImportResult(result, response);
          response.success++;
        }

        response.results.push(result);
      }
    }

    return new ResponseBuilder<ImportResponseDto<ImportDeviceGroupResultDto>>()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData(response)
      .build();
  }

  async getImportTemplate(): Promise<
    ResponsePayload<GetImportTemplateResponseDto>
  > {
    const templateFile = await this.importService.getImportTemplate(
      IMPORT_DEVICE_GROUP_CONST,
    );

    return new ResponseBuilder<GetImportTemplateResponseDto>()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData({
        fileName: IMPORT_DEVICE_GROUP_CONST.FILE_NAME,
        fileContent: templateFile,
      })
      .build();
  }

  async createMany(
    data: any,
    userId: number,
  ): Promise<{ dataSuccess: any[]; dataError: any[] }> {
    const dataToInsert = [];
    const dataToUpdate = [];
    const codesInsert = [];
    const codesUpdate = [];
    const textAdd = await this.i18n.translate('import.common.add');

    data.forEach((item) => {
      if (item.action === textAdd) {
        dataToInsert.push(item);
        codesInsert.push(item.code);
      } else {
        dataToUpdate.push(item);
        codesUpdate.push(item.code);
      }
    });

    const assigns: string[] = compact(data.map((item) => item.assign));

    const deviceGroupCodeInsertExists =
      await this.deviceGroupRepository.findAllByCondition({
        code: {
          $in: codesInsert,
        },
      });

    const deviceGroupCodeUpdateExists =
      await this.deviceGroupRepository.findAllByCondition({
        code: {
          $in: codesUpdate,
        },
      });

    const deviceGroupInsertMap = keyBy(deviceGroupCodeInsertExists, 'code');
    const deviceGroupUpdateMap = keyBy(deviceGroupCodeUpdateExists, 'code');

    const dataError = [];
    const dataInsert = [];
    const dataUpdate = [];

    dataToInsert.forEach((item) => {
      if (has(deviceGroupInsertMap, item.code)) {
        dataError.push(item);
      } else {
        dataInsert.push(item);
      }
    });

    dataToUpdate.forEach((item) => {
      if (!has(deviceGroupUpdateMap, item.code)) {
        dataError.push(item);
      } else {
        dataUpdate.push(item);
      }
    });

    const maintenanceTeams =
      await this.maintenanceTeamRepository.findAllByCondition({
        code: {
          $in: assigns,
        },
      });

    const users = await this.userService.getUsersByUsernames(assigns);

    const userMap = keyBy(users, 'username');
    const maintenanceTeamMap = keyBy(maintenanceTeams, 'code');

    const deviceGroupDocuments = dataInsert.map((item) => {
      const deviceGroup = this.deviceGroupRepository.createDocument({
        code: item.code,
        name: item.name,
        description: item.description,
        status: DeviceGroupStatusConstant.AWAITING,
        responsibleUserIds: userMap[item.assign]?.id,
        responsibleMaintenanceTeam: maintenanceTeamMap[item.assign]?._id,
      });

      deviceGroup.histories.push({
        userId: userId,
        action: HistoryActionEnum.CREATE,
        createdAt: new Date(),
      });

      return deviceGroup;
    });

    const dataSuccess = await this.deviceGroupRepository.createMany(
      deviceGroupDocuments,
    );

    const dataUpdateMap = keyBy(dataUpdate, 'code');
    await Promise.all(
      deviceGroupCodeUpdateExists.map((deviceGroup) => {
        deviceGroup.name = dataUpdateMap[deviceGroup.code]?.name;
        deviceGroup.description = dataUpdateMap[deviceGroup.code]?.description;
        deviceGroup.responsibleUserIds =
          userMap[dataUpdateMap[deviceGroup.code]?.assign]?.id;
        deviceGroup.responsibleMaintenanceTeam =
          maintenanceTeamMap[dataUpdateMap[deviceGroup.code]?.assign]?._id;
        return deviceGroup.save();
      }),
    );

    return {
      dataError,
      dataSuccess: [...dataSuccess, dataUpdate],
    };
  }
}
