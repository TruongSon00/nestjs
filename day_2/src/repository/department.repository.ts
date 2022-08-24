
export interface IBaseRepository<T> {

    find(filter: object): Promise<T[]>
    findOne(id: any): Promise<T>
    create(item: any): Promise<T>
    update(id: any, item: any): Promise<T | any>
    delete(id: any): Promise<boolean | any>

}