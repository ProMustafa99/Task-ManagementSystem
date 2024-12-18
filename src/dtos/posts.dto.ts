import { IsString, IsNotEmpty, IsNumber, IsDate, IsOptional, MinLength, MaxLength } from 'class-validator';

export class CreatePostDto {
  
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  public title_en: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  public title_ar: string;

  @IsString()
  @IsNotEmpty()
  public description_en: string;

  @IsOptional()  
  @IsString()
  public description_ar: string;

  @IsNumber()
  @IsOptional()
  public state_id: number;

  @IsOptional()  
  @IsNumber()
  public created_by: number;

  @IsOptional()  
  @IsDate()
  @IsNotEmpty()
  public created_on: Date;
}

export class UpdatePostDto {

    @IsOptional()
    @IsString()
    public title_en?: string;
    

    @IsOptional()
    @IsString()
    public title_ar?: string;

    @IsOptional()
    @IsString()
    public description_en?: string;

    @IsOptional()
    @IsString()
    public description_ar?: string;

    @IsOptional()
    @IsNumber()
    public state_id?: number;
    public created_by?: number;

    @IsOptional()
    @IsDate()
    public created_on?: Date;
}