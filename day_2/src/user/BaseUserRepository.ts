import { IUser, User } from "src/model/user.model";
import { validateRequestCreate, validateRequestEdit, validateRequestFindId } from "src/requestValidate/requestUser";
import { IBaseRepository } from '../repository/IBaseRepository';

export class BaseUserRepository implements IBaseRepository<IUser> {



    async find(filter: object): Promise<IUser[]> {
        return await User.find(filter)
    }
    findOne(id: validateRequestFindId): Promise<IUser> {
        throw new Error("Method not implemented.");
    }
    async create(item: validateRequestCreate): Promise<IUser> {
        console.log(item);
        return await User.create(item)

    }
    update(id: validateRequestFindId, item: validateRequestEdit): Promise<any> {
        throw new Error("Method not implemented.");
    }
    delete(id: validateRequestFindId): Promise<any> {
        throw new Error("Method not implemented.");
    }

}
