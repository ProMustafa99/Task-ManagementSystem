import { IsString, IsEmail, IsNotEmpty, MinLength, MaxLength, IsNumber, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  public email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(32)
  public password: string;

  @IsString()
  public user_name: string;
}

export class LoginDto {
  @IsEmail()
  public email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(32)
  public password: string;

}


export class UpdateUserDto {
  @IsString()
  public password: string;

  @IsEmail()
  public email: string;

  @IsString()
  public user_name: string;

  @IsNumber()
  @IsOptional()
  public status :number;
}
