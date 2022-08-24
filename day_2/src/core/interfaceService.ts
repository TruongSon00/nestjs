export interface IService {
    // name: string
    create(collection: any): Promise<any>
    getList(filter: object): Promise<any>
    edit(id: string, data: any): Promise<any>
    getById(id: string): Promise<any>
    delete(id: string): Promise<any>
}