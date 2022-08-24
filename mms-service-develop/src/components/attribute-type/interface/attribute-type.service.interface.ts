import { ResponsePayload } from '@utils/response-payload';
import { GetListAttributeTypeQuery } from '../dto/query/get-list-attribute-type.query';
import { CreateAttributeTypeRequest } from '../dto/request/create-attribute-type.request';
import { DetailAttributeTypeRequest } from '../dto/request/detail-attribute-type.request';
import { UpdateAttributeTypeRequest } from '../dto/request/update-attribute-type.request';
import { ValidateCodeRequest } from '../dto/request/validate-code.request';

export interface AttributeTypeServiceInterface {
  create(request: CreateAttributeTypeRequest): Promise<ResponsePayload<any>>;
  update(request: UpdateAttributeTypeRequest): Promise<ResponsePayload<any>>;
  detail(request: DetailAttributeTypeRequest): Promise<ResponsePayload<any>>;
  delete(request: DetailAttributeTypeRequest): Promise<ResponsePayload<any>>;
  list(request: GetListAttributeTypeQuery): Promise<ResponsePayload<any>>;
  validateCode(request: ValidateCodeRequest): Promise<ResponsePayload<any>>;
  import(data: any): Promise<{ dataSuccess: any[]; dataError: any[] }>;
}
