import { IsString, IsNotEmpty, IsNumber, MaxLength, IsOptional, IsDate } from 'class-validator';

export class CreateBlogDto {
    @IsString({ message: 'Title in English must be a valid string.' })
    @IsNotEmpty({ message: 'Title in English is required.' })
    @MaxLength(255, { message: 'Title in English should not exceed 255 characters.' })
    public title_en: string;

    @IsString({ message: 'Title in Arabic must be a valid string.' })
    @IsNotEmpty({ message: 'Title in Arabic is required.' })
    @MaxLength(255, { message: 'Title in Arabic should not exceed 255 characters.' })
    public title_ar: string;

    @IsString({ message: 'URL in English must be a valid string.' })
    @IsNotEmpty({ message: 'URL in English is required.' })
    @MaxLength(255, { message: 'URL in English should not exceed 255 characters.' })
    public url_en: string;

    @IsString({ message: 'URL in Arabic must be a valid string.' })
    @IsNotEmpty({ message: 'URL in Arabic is required.' })
    @MaxLength(255, { message: 'URL in Arabic should not exceed 255 characters.' })
    public url_ar: string;

    @IsNumber({}, { message: 'Created by must be a valid number.' })
    @IsNotEmpty({ message: 'Created by is required.' })
    public created_by: number;
}


export class UpdateBlogDto {
    @IsOptional()
    @IsString({ message: 'Title in English must be a valid string.' })
    @MaxLength(255, { message: 'Title in English should not exceed 255 characters.' })
    public title_en?: string;

    @IsOptional()
    @IsString({ message: 'Title in Arabic must be a valid string.' })
    @MaxLength(255, { message: 'Title in Arabic should not exceed 255 characters.' })
    public title_ar?: string;

    @IsOptional()
    @IsString({ message: 'URL in English must be a valid string.' })
    @MaxLength(255, { message: 'URL in English should not exceed 255 characters.' })
    public url_en?: string;

    @IsOptional()
    @IsString({ message: 'URL in Arabic must be a valid string.' })
    @MaxLength(255, { message: 'URL in Arabic should not exceed 255 characters.' })
    public url_ar?: string;

    @IsNumber({}, { message: 'Updated by must be a valid number.' })
    @IsNotEmpty({ message: 'Updated by is required when updating a tag.' })
    public updated_by?: number;


    @IsDate({ message: 'Updated on must be a valid date.' })
    @IsNotEmpty({ message: 'Updated on is required when updating a tag.' })
    public updated_on?: Date;

    @IsOptional()
    @IsDate({ message: 'Deleted on must be a valid date.' })
    public deleted_on?: Date;

    @IsOptional()
    @IsNumber({}, { message: 'Deleted by must be a valid number.' })
    public deleted_by?: number;
}

