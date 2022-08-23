import { Schema, model, ObjectId, Types } from 'mongoose';



export interface IUser {
    name: string,
    age: number,
    department: [{
        depatmentid: ObjectId,
        role: number
    }],
}


const userScheme = new Schema<IUser>({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    department: [{
        depatmentid: { type: Types.ObjectId, required: true },
        role: { type: Number }

    }],
})



export const User = model('user', userScheme)
