import { Schema, model, ObjectId, Types } from 'mongoose';



export interface IUser {
    name: string,
    age: number,
    department: [{
        departmentId: ObjectId,
        role: number
    }],
}


export const userSchema = new Schema<IUser>({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    department: [{
        departmentId: { type: Types.ObjectId, required: true },
        role: { type: Number }

    }],
})



export const User = model('user', userSchema)

