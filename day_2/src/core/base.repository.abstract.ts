import { Model } from "mongoose";
import { validateRequestFindId } from "src/requestValidate/requestUser";
import { repositoryInterface } from "./repository.interface";

export abstract class baseRepositoryAbstract<T> implements repositoryInterface<T>{

    private model: Model<T>

    constructor(model: Model<T>) {
        this.model = model
    }

    async create(collection: object): Promise<any> {
        return await this.model.create(collection)

    }
    async getList(filter: object): Promise<T[]> {
        return await this.model.find(filter)

    }
    async edit(id: any, data: any): Promise<any> {
        return await this.model.findByIdAndUpdate(id, data)

    }
    async getById(id: any): Promise<T> {

        return await this.model.findById(id)

    }
    async delete(id: any): Promise<any> {
        return await this.model.findByIdAndDelete(id)

    }

}