import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional, IsMobilePhone } from "class-validator";

export default class AccountDTO {
    @ApiProperty()
    @IsString()
    @IsOptional()
    firstName?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    lastName?: string;

    @ApiProperty()
    @IsMobilePhone()
    // @Matches(/^[0-9]{9,11}$/, {message: 'phoneNumber should be a phone number.'})
    phoneNumber?: string;
}