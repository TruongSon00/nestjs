import { Injectable } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { Connection, Model } from "mongoose";
import { baseRepositoryAbstract } from "src/core/base.repository.abstract";
import { IUser } from "src/model/user.model";
import { validateRequestCreate } from "src/requestValidate/requestUser";
import { IUserRepository } from "src/user/interface/user.interface.repository";

@Injectable()
export class userRepository
    extends baseRepositoryAbstract<IUser>
    implements IUserRepository {

    private userModel: Model<IUser>
    constructor(
        @InjectModel('users')
        userModel: Model<IUser>
    ) {
        super(userModel)
    }

    createUser(user: validateRequestCreate): Promise<IUser> {
        let { name, age, departmentId, role } = user
        role = role || 0
        // const newUser = this.userModel.create()
        console.log(this.userModel);
        // newUser.name = name
        // newUser.age = age
        // newUser.department[0].departmentId = departmentId
        // newUser.department[0].role = role
        // return newUser.save()
        throw new Error("");

    }



}