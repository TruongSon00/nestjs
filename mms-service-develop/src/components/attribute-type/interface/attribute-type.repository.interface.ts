import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { AttributeType } from 'src/models/attribute-type/attribute-type.model';
import { GetListAttributeTypeQuery } from '../dto/query/get-list-attribute-type.query';
import { CreateAttributeTypeRequest } from '@components/attribute-type/dto/request/create-attribute-type.request';
import { ListAttributeTypeResponse } from '../dto/response/list-attribute-type.response';

export interface AttributeTypeRepositoryInterface
  extends BaseAbstractRepository<AttributeType> {
  createEntity(request: CreateAttributeTypeRequest): AttributeType;
  list(request: GetListAttributeTypeQuery): Promise<ListAttributeTypeResponse>;
  findAllWithPopulate(condition: any, populate: any): Promise<any[]>;
  findOneWithPopulate(condition: any, populate: any): Promise<any>;
}
