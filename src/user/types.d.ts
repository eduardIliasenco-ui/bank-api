import { IAccount } from "src/account/types";
import { BaseEntity } from "typeorm";
import { User } from "./entities/user.entity";

export interface IUser extends BaseEntity {
    id: string;
    email: string;
    password: string;
    account: IAccount;
}

export interface ILoginResponse { 
    user: User; 
    token: { 
        expiresIn: number; 
        accessToken: string; 
    }; 
}