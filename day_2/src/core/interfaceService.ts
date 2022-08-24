export interface IService {
    // name: string
    create(collection: any): Promise<any>
    getList(filter: object): Promise<any>
    edit(id: any, data: any): Promise<any>
    getById(id: any): Promise<any>
    delete(id: any): Promise<any>
}