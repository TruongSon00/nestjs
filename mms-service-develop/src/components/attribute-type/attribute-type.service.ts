import { UnitRepositoryInterface } from '@components/unit/interface/unit.repository.interface';
import { ResponseCodeEnum } from '@constant/response-code.enum';
import { Inject, Injectable } from '@nestjs/common';
import { ApiError } from '@utils/api.error';
import { ResponseBuilder } from '@utils/response-builder';
import { ResponsePayload } from '@utils/response-payload';
import { plainToInstance } from 'class-transformer';
import { isEmpty, keyBy, uniq, has, map } from 'lodash';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { GetListAttributeTypeQuery } from './dto/query/get-list-attribute-type.query';
import { CreateAttributeTypeRequest } from './dto/request/create-attribute-type.request';
import { DetailAttributeTypeRequest } from './dto/request/detail-attribute-type.request';
import { UpdateAttributeTypeRequest } from './dto/request/update-attribute-type.request';
import { ValidateCodeRequest } from './dto/request/validate-code.request';
import { DetailAttributeTypeResponse } from './dto/response/detail-attribute-type.response';
import { AttributeTypeRepositoryInterface } from './interface/attribute-type.repository.interface';
import { AttributeTypeServiceInterface } from './interface/attribute-type.service.interface';

@Injectable()
export class AttributeTypeService implements AttributeTypeServiceInterface {
  constructor(
    @Inject('AttributeTypeRepositoryInterface')
    private readonly attributeTypeRepository: AttributeTypeRepositoryInterface,

    @Inject('UnitRepositoryInterface')
    private readonly unitRepository: UnitRepositoryInterface,

    private readonly i18n: I18nRequestScopeService,
  ) {}

  async create(
    request: CreateAttributeTypeRequest,
  ): Promise<ResponsePayload<any>> {
    const { code } = request;
    const attributeTypeExists =
      await this.attributeTypeRepository.findOneByCode(code);
    if (attributeTypeExists) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.CODE_IS_ALREADY_EXISTS'),
      ).toResponse();
    }
    try {
      const unit = await this.unitRepository.findOneById(request.unit);

      if (!unit) {
        return new ApiError(
          ResponseCodeEnum.NOT_FOUND,
          await this.i18n.translate('error.UNIT_NOT_FOUND'),
        ).toResponse();
      }

      const document = this.attributeTypeRepository.createEntity(request);
      await document.save();
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('success.SUCCESS'))
        .build();
    } catch (error) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.BAD_REQUEST'))
        .build();
    }
  }

  async update(
    request: UpdateAttributeTypeRequest,
  ): Promise<ResponsePayload<any>> {
    try {
      let document = await this.attributeTypeRepository.findOneById(request.id);

      if (!document) {
        return new ApiError(
          ResponseCodeEnum.NOT_FOUND,
          await this.i18n.translate('error.NOT_FOUND'),
        ).toResponse();
      }

      if (document?.code !== request?.code) {
        const documentWithCode =
          await this.attributeTypeRepository.findOneByCondition({
            _id: {
              $ne: request.id,
            },
            deletedAt: null,
            code: request?.code,
          });

        if (documentWithCode) {
          return new ApiError(
            ResponseCodeEnum.BAD_REQUEST,
            await this.i18n.translate('error.CODE_IS_ALREADY_EXISTS'),
          ).toResponse();
        }
      }

      const unit = await this.unitRepository.findOneById(request.unit);

      if (!unit) {
        return new ApiError(
          ResponseCodeEnum.NOT_FOUND,
          await this.i18n.translate('error.UNIT_NOT_FOUND'),
        ).toResponse();
      }

      document = this.attributeTypeRepository.createEntity(request);

      await this.attributeTypeRepository.create(document);

      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('success.SUCCESS'))
        .build();
    } catch (error) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.BAD_REQUEST'))
        .build();
    }
  }

  async detail(
    request: DetailAttributeTypeRequest,
  ): Promise<ResponsePayload<any>> {
    try {
      const attributeType =
        await this.attributeTypeRepository.findOneWithPopulate(
          {
            _id: request.id,
          },
          {
            path: 'unit',
          },
        );

      if (!attributeType) {
        return new ApiError(
          ResponseCodeEnum.NOT_FOUND,
          await this.i18n.translate('error.NOT_FOUND'),
        ).toResponse();
      }

      const dataReturn = plainToInstance(
        DetailAttributeTypeResponse,
        attributeType,
        {
          excludeExtraneousValues: true,
        },
      );

      return new ResponseBuilder(dataReturn)
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('success.SUCCESS'))
        .build();
    } catch (error) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.BAD_REQUEST'))
        .build();
    }
  }

  async delete(
    request: DetailAttributeTypeRequest,
  ): Promise<ResponsePayload<any>> {
    try {
      const document = await this.attributeTypeRepository.findOneById(
        request.id,
      );

      if (!document) {
        return new ApiError(
          ResponseCodeEnum.NOT_FOUND,
          await this.i18n.translate('error.NOT_FOUND'),
        ).toResponse();
      }

      document.deletedAt = new Date();
      await document.save();

      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('success.SUCCESS'))
        .build();
    } catch (error) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.BAD_REQUEST'))
        .build();
    }
  }

  async list(
    request: GetListAttributeTypeQuery,
  ): Promise<ResponsePayload<any>> {
    const { data, count } = await this.attributeTypeRepository.list(request);
    const dataReturn = plainToInstance(DetailAttributeTypeResponse, data, {
      excludeExtraneousValues: true,
    });
    return new ResponseBuilder({
      result: dataReturn,
      meta: { total: count, page: request.page, size: request.limit },
    })
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('success.SUCCESS'))
      .build();
  }

  async validateCode(
    request: ValidateCodeRequest,
  ): Promise<ResponsePayload<any>> {
    const attributeType = await this.attributeTypeRepository.findOneByCode(
      request.code,
    );

    let status = true;

    if (!isEmpty(attributeType)) {
      status = false;
    }

    return new ResponseBuilder({
      status,
    })
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('success.SUCCESS'))
      .build();
  }

  async import(data: any): Promise<{ dataSuccess: any[]; dataError: any[] }> {
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

    const attributeTypeCodeInsertExists =
      await this.attributeTypeRepository.findAllByCondition({
        code: { $in: codesInsert },
      });
    const attributeTypeCodeUpdateExists =
      await this.attributeTypeRepository.findAllByCondition({
        code: { $in: codesUpdate },
      });
    const attributeTypeInsertMap = keyBy(attributeTypeCodeInsertExists, 'code');
    const attributeTypeUpdateMap = keyBy(attributeTypeCodeUpdateExists, 'code');
    const unitCodes = uniq(map(data, 'unitCode'));
    const units = await this.unitRepository.findAllByCondition({
      code: {
        $in: unitCodes,
      },
    });
    const unitMap = keyBy(units, 'code');
    const dataError = [];
    const dataInsert = [];
    const dataUpdate = [];
    dataToInsert.forEach((item) => {
      if (
        has(attributeTypeInsertMap, item.code) ||
        !has(unitMap, item.unitCode)
      ) {
        dataError.push(item);
      } else {
        dataInsert.push(item);
      }
    });
    dataToUpdate.forEach((item) => {
      if (
        !has(attributeTypeUpdateMap, item.code) ||
        !has(unitMap, item.unitCode)
      ) {
        dataError.push(item);
      } else {
        dataUpdate.push(item);
      }
    });

    const attributeTypeDocuments = dataInsert.map((item) => {
      const createRequest = new CreateAttributeTypeRequest();
      createRequest.code = item.code;
      createRequest.name = item.name;
      createRequest.description = item.description;
      createRequest.unit = unitMap[item.unitCode]._id;

      const attributeType =
        this.attributeTypeRepository.createEntity(createRequest);
      return attributeType;
    });
    const dataSuccess = await this.attributeTypeRepository.createMany(
      attributeTypeDocuments,
    );
    const dataUpdateMap = keyBy(dataUpdate, 'code');

    await Promise.all(
      attributeTypeCodeUpdateExists.map((attributeType) => {
        attributeType.name = dataUpdateMap[attributeType.code]?.name;
        attributeType.description =
          dataUpdateMap[attributeType.code]?.description;
        attributeType.unit =
          unitMap[dataUpdateMap[attributeType.code].unitCode]._id;
        return attributeType.save();
      }),
    );

    return {
      dataError,
      dataSuccess: [...dataSuccess, ...attributeTypeCodeUpdateExists],
    };
  }
}
