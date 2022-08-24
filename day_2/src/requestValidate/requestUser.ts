import {
    IsString, Min, IsInt, IsNotEmpty, IsMongoId, Max
} from "class-validator";
import { ObjectId } from "mongoose";

export class validateRequestCreate {
    @IsString()
    @IsNotEmpty()
    name: string

    @IsInt()
    @Min(10)
    @Max(100)
    @IsNotEmpty()
    age: number

    @IsNotEmpty()
    @IsMongoId()
    departmentId: ObjectId

    @IsInt()
    role: number
}

export class validateRequestEdit {
    @IsString()
    @IsNotEmpty()
    name: string

    @IsInt()
    @Min(10)
    @Max(100)
    @IsNotEmpty()
    age: number
}

export class validateRequestFindId {
    @IsMongoId()
    @IsNotEmpty()
    id: string
}