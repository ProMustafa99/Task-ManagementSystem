import { IsInt, IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateUserPermissionDto {
    @IsInt({ message: "Permissions needs to be a number"})
    @IsNotEmpty({ message: "Permissions cannot be empty"})
    public permission: number;

    @IsString({ message: 'Title in Arabic must be a valid string.' })
    @IsNotEmpty({ message: 'Title in Arabic is required.' })
    @MaxLength(255, { message: 'Title in Arabic should not exceed 255 characters.' })
    public user_id: number;
}