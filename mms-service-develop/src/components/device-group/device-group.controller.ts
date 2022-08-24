import {
  Body,
  Controller,
  Inject,
  Param,
  Query,
  Post,
  Put,
  Get,
  Delete,
} from '@nestjs/common';
import { DeviceGroupServiceInterface } from '@components/device-group/interface/device-group.service.interface';
import { MessagePattern } from '@nestjs/microservices';
import { CreateDeviceGroupRequestDto } from '@components/device-group/dto/request/create-device-group.request.dto';
import { isEmpty } from 'lodash';
import { UpdateDeviceGroupRequestBody } from '@components/device-group/dto/request/update-device-group.request.dto';
import { GetListDeviceGroupRequestDto } from '@components/device-group/dto/request/get-list-device-group.request.dto';
import { ConfirmDeviceGroupParamDto } from '@components/device-group/dto/request/confirm-device-group.request.dto';
import { ExportDeviceGroupRequestDto } from '@components/device-group/dto/request/export-device-group.request.dto';
import { ImportRequestDto } from '@components/import/dto/request/import.request.dto';
import { ResponsePayload } from '@utils/response-payload';
import { ImportResponseDto } from '@components/import/dto/response/import.response.dto';
import { GetImportTemplateResponseDto } from '@components/import/dto/response/get-import-template.response.dto';
import { ImportDeviceGroupResultDto } from '@components/device-group/dto/response/import-device-group-result.dto';
import { DetailDeviceGroupRequestDto } from './dto/request/detail-device-group.request.dto';
import { DeleteDeviceGroupRequestDto } from './dto/request/delete-device-group.request.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetDetailDeviceGroupResponseDto } from './dto/response/get-detail-device-group.response.dto';
import { UpdateDeviceGroupResponseDto } from './dto/response/update-device-group.response.dto';
import { SuccessResponse } from '@utils/success.response.dto';
import { CONFIRM_DEVICE_GROUP_PERMISSION, CREATE_DEVICE_GROUP_PERMISSION, DELETE_DEVICE_GROUP_PERMISSION, DETAIL_DEVICE_GROUP_PERMISSION, EXPORT_DEVICE_GROUP_PERMISSION, IMPORT_DEVICE_GROUP_PERMISSION, LIST_DEVICE_GROUP_PERMISSION, UPDATE_DEVICE_GROUP_PERMISSION } from '@utils/permissions/device-group';
import { PermissionCode } from '@core/decorator/get-code.decorator';
@Controller()
export class DeviceGroupController {
  constructor(
    @Inject('DeviceGroupServiceInterface')
    private readonly deviceGroupService: DeviceGroupServiceInterface,
  ) {}
  //@MessagePattern('create_device_group')
  @PermissionCode(CREATE_DEVICE_GROUP_PERMISSION.code)
  @Post('/device-groups')
  @ApiOperation({
    tags: ['Device group'],
    summary: 'Create Device group',
    description: 'Create a new Device group',
  })
  @ApiResponse({
    status: 200,
    description: 'Created successfully',
  })
  async create(@Body() payload: CreateDeviceGroupRequestDto): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.deviceGroupService.create(request);
  }
  //@MessagePattern('detail_device_group')
  @PermissionCode(DETAIL_DEVICE_GROUP_PERMISSION.code)
  @Get('/device-groups/:id')
  @ApiOperation({
    tags: ['Device Group'],
    summary: 'Detail Device Group',
    description: 'Detail Device Group',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: GetDetailDeviceGroupResponseDto,
  })
  async detail(@Param() payload: DetailDeviceGroupRequestDto): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.deviceGroupService.detail(request);
  }

  //@MessagePattern('update_device_group')
  @PermissionCode(UPDATE_DEVICE_GROUP_PERMISSION.code)
  @Put('/device-groups/:id')
  @ApiOperation({
    tags: ['Device Group'],
    summary: 'Update Device Group',
    description: 'Update an existing Device Group',
  })
  @ApiResponse({
    status: 200,
    description: 'Update successfully',
    type: UpdateDeviceGroupResponseDto,
  })
  async update(
    @Body() payload: UpdateDeviceGroupRequestBody,
    @Param('id') id: string,
  ): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    request._id = id;
    return await this.deviceGroupService.update(request);
  }

  //@MessagePattern('list_device_group')
  @PermissionCode(LIST_DEVICE_GROUP_PERMISSION.code)
  @Get('/device-groups/list')
  @ApiOperation({
    tags: ['Device Group List'],
    summary: 'List Of Device Group',
    description: 'List Of Device Group',
  })
  @ApiResponse({
    status: 200,
    description: 'Get List successfully',
    type: null,
  })
  async getList(@Query() payload: GetListDeviceGroupRequestDto): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.deviceGroupService.getList(request);
  }

  //@MessagePattern('delete_device_group')
  @PermissionCode(DELETE_DEVICE_GROUP_PERMISSION.code)
  @Delete('/device-groups/:id')
  @ApiOperation({
    tags: ['Device Category'],
    summary: 'Delete Device Category',
    description: 'Delete an existing Device Category',
  })
  @ApiResponse({
    status: 200,
    description: 'Delete successfully',
    type: SuccessResponse,
  })
  async delete(@Param() payload: DeleteDeviceGroupRequestDto): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.deviceGroupService.delete(request);
  }

  // @MessagePattern('confirm_device_group')
  @PermissionCode(CONFIRM_DEVICE_GROUP_PERMISSION.code)
  @Put('/device-groups/:id/confirmed')
  @ApiOperation({
    tags: ['Device Group'],
    summary: 'Confirm Device Group',
    description: 'Confirm an existing Device Group',
  })
  @ApiResponse({
    status: 200,
    description: 'Confirm successfully',
    type: UpdateDeviceGroupResponseDto,
  })
  async confirmDeviceGroup(
    @Param() param: ConfirmDeviceGroupParamDto,
  ): Promise<any> {
    const { request, responseError } = param;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    request._id = request.id;
    return await this.deviceGroupService.confirm(request);
  }
  //@MessagePattern('export_device_group')
  @PermissionCode(EXPORT_DEVICE_GROUP_PERMISSION.code)
  @Post('device-groups/export')
  @ApiOperation({
    tags: ['Export Device Group'],
    summary: 'Export Device Group',
    description: 'Export Device Group',
  })
  @ApiResponse({
    status: 200,
    description: 'Export successfully',
  })
  public async exportDeviceGroup(
    @Body() payload: ExportDeviceGroupRequestDto,
  ): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.deviceGroupService.exportDeviceGroup(request);
  }

  @PermissionCode(IMPORT_DEVICE_GROUP_PERMISSION.code)
  @MessagePattern('import_device_group')
  public async import(
    @Body() payload: ImportRequestDto,
  ): Promise<ResponsePayload<ImportResponseDto<ImportDeviceGroupResultDto>>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.deviceGroupService.import(request);
  }

  @MessagePattern('get_import_template_device_group')
  public async getImportTemplate(): Promise<
    ResponsePayload<GetImportTemplateResponseDto>
  > {
    return await this.deviceGroupService.getImportTemplate();
  }
}
