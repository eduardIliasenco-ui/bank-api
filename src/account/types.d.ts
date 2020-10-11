import { IUser } from "src/user/types";
import { BaseEntity } from "typeorm";

export interface IAccount extends BaseEntity {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    user: IUser;
}