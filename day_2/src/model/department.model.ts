import { Schema, model, ObjectId } from 'mongoose';

export interface IDepartment {
    name: string,
    descript: String
}

const departmentSchema = new Schema<IDepartment>({
    name: { type: String, required: true },
    descript: { type: String, required: true },
})