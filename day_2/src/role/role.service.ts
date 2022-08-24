import { Injectable } from '@nestjs/common';
import { userInfo } from 'os';
import { User } from 'src/model/user.model';
import { Types, ObjectId } from 'mongoose';
import Ajv from 'ajv';
// @Injectable()
export class RoleService {



    ajv = new Ajv()

    checkId(id: any) {
        if (Types.ObjectId.isValid(id))
            return (new Types.ObjectId(id) == id)
        else
            return false
    }


    promissErr(message: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            reject(message)
        })
    }
    promissSucces(message: string, data: any): Promise<any> {
        return new Promise<any>((resolve) => {
            resolve({ message, data })
        })
    }




    edit(userId: string, data: { departmentId: string, role: number }): Promise<any> {

        const { departmentId, role } = data
        if (!this.checkId(departmentId) || !this.checkId(userId))
            throw new Error("Du lieu khong hop le");
        if (role !== role * 1)
            throw new Error("Du lieu khong hop le");

        const user = User.findById(userId)

        return this.promissSucces('update role succes', {})
    }

    create(collection: any): Promise<any> {
        throw new Error('Method not implemented.');
    }

    delete(id: string): Promise<any> {
        throw new Error('Method not implemented.');
    }

    // -------- unuse -------
    getList(filter: object): Promise<any> {
        throw new Error('Method not implemented.');
    }
    getById(id: string): Promise<any> {
        throw new Error('Method not implemented.');
    }

}
