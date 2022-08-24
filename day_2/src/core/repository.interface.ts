export interface repositoryInterface<T> {
    // name: string
    create(collection: object): Promise<T | any>
    getList(filter: object): Promise<T[]>
    edit(id: any, data: any): Promise<T | any>
    getById(id: any): Promise<T>
    delete(id: any): Promise<any>
}