import {
  Body,
  Query,
  Param,
  Controller,
  Inject,
  Injectable,
  Post,
  Put,
  Get,
  Delete,
} from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { isEmpty } from 'lodash';
import { GetListAttributeTypeQuery } from './dto/query/get-list-attribute-type.query';
import { CreateAttributeTypeRequest } from './dto/request/create-attribute-type.request';
import { DetailAttributeTypeRequest } from './dto/request/detail-attribute-type.request';
import {
  UpdateAttributeTypeBodyDto,
  UpdateAttributeTypeRequest,
} from './dto/request/update-attribute-type.request';
import { ValidateCodeRequest } from './dto/request/validate-code.request';
import { AttributeTypeServiceInterface } from './interface/attribute-type.service.interface';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SuccessResponse } from '@utils/success.response.dto';
import { DetailAttributeTypeResponse } from './dto/response/detail-attribute-type.response';
import { ListAttributeTypeResponse } from './dto/response/list-attribute-type.response';
import { ValidateSerialResponse } from './dto/response/validate-serial.response.dto';

@Injectable()
@Controller()
export class AttributeTypeController {
  constructor(
    @Inject('AttributeTypeServiceInterface')
    private readonly attributeTypeService: AttributeTypeServiceInterface,
  ) {}

  //@MessagePattern('create_attribute_type')
  @Post('/attribute-type')
  @ApiOperation({
    tags: ['Create attribute type'],
    summary: 'Định nghĩa loại giá trị',
    description: 'Định nghĩa loại giá trị',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: SuccessResponse,
  })
  async create(@Body() payload: CreateAttributeTypeRequest): Promise<any> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.attributeTypeService.create(request);
  }

  //@MessagePattern('update_attribute_type')
  @Put('attribute-type/:id')
  @ApiOperation({
    tags: ['Update attribute type'],
    summary: 'Cập nhật loại giá trị',
    description: 'Cập nhật loại giá trị',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: SuccessResponse,
  })
  async update(
    @Param('id') id: string,
    @Body() payload: UpdateAttributeTypeBodyDto,
  ): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.attributeTypeService.update({
      id,
      ...request,
    });
  }

  //@MessagePattern('detail_attribute_type')
  @Get('/attribute-type/:id')
  @ApiOperation({
    tags: ['Detail attribute type'],
    summary: 'Chi tiết loại giá trị',
    description: 'Chi tiết loại giá trị',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: DetailAttributeTypeResponse,
  })
  async detail(@Param() param: DetailAttributeTypeRequest): Promise<any> {
    const { request, responseError } = param;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.attributeTypeService.detail(request);
  }

  //@MessagePattern('delete_attribute_type')
  @Delete('/attribute-type/:id')
  @ApiOperation({
    tags: ['Detail attribute type'],
    summary: 'Chi tiết loại giá trị',
    description: 'Chi tiết loại giá trị',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: SuccessResponse,
  })
  async delete(@Param() param: DetailAttributeTypeRequest): Promise<any> {
    const { request, responseError } = param;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.attributeTypeService.delete(request);
  }

  //@MessagePattern('list_attribute_type')
  @Get('/attribute-type')
  @ApiOperation({
    tags: ['List attribute type'],
    summary: 'Danh sách loại giá trị',
    description: 'Danh sách loại giá trị',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: ListAttributeTypeResponse,
  })
  async list(@Query() query: GetListAttributeTypeQuery): Promise<any> {
    const { request, responseError } = query;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.attributeTypeService.list(request);
  }

  //@MessagePattern('validate_attribute_type')
  @Post('/validate-attribute-type')
  @ApiOperation({
    tags: ['validate attribute type'],
    summary: 'Kiểm tra loại giá trị',
    description: 'Kiểm tra loại giá trị',
  })
  @ApiResponse({
    status: 200,
    description: 'Validate successfully',
    type: ValidateSerialResponse,
  })
  async validateSerial(@Body() payload: ValidateCodeRequest): Promise<any> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.attributeTypeService.validateCode(request);
  }
}
