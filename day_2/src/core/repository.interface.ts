export interface repositoryInterface<T> {
  create(collection: object): Promise<T | any>;
  getList(filter: object): Promise<T[]>;
  getListWithAggregate(
    filter: object,
    lookup: any,
    sort: object,
    limit?: number,
  ): Promise<T[] | any>;
  getByIdWithAggregate(
    filter: object,
    lookup: any,
    sort: object,
    unwind?: string,
    limit?: number,
  ): Promise<T | any>;
  edit(id: any, data: any): Promise<T | any>;
  getById(id: any): Promise<T>;
  delete(id: any): Promise<any>;
}
