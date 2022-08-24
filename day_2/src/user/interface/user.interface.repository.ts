import { baseRepositoryAbstract } from "src/core/base.repository.abstract";
import { IUser } from "src/model/user.model";
import { validateRequestCreate } from "src/requestValidate/requestUser";

export interface IUserRepository extends baseRepositoryAbstract<IUser> {
    createUser(user: validateRequestCreate): Promise<IUser | any>
}