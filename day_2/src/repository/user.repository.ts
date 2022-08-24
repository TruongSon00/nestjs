import { Model } from "mongoose";
import { baseRepositoryAbstract } from "src/core/base.repository.abstract";
import { IUser } from "src/model/user.model";
import { validateRequestCreate } from "src/requestValidate/requestUser";
import { IUserRepository } from "src/user/interface/user.interface.repository";

export class userRepository
    extends baseRepositoryAbstract<IUser>
    implements IUserRepository {

    private userModel: Model<IUser>
    constructor(userModel: Model<IUser>) {
        super(userModel)
    }

    createUser(user: validateRequestCreate): Promise<IUser> {
        let { name, age, departmentId, role } = user
        role = role || 0
        const newUser = new this.userModel()
        newUser.name = name
        newUser.age = age
        newUser.department[0].departmentId = departmentId
        newUser.department[0].role = role
        return newUser.save()
    }



}