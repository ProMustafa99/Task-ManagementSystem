import { IsInt, IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateUserPermissionDto {
    @IsInt({ message: "Permissions needs to be a number"})
    @IsNotEmpty({ message: "Permissions cannot be empty"})
    public permission: number;

    @IsInt({ message: "User id needs to be a number"})
    @IsNotEmpty({ message: 'User id is required.' })
    public user_id: number;
}