import { IsString, IsNumber, IsOptional, MaxLength, IsNotEmpty, IsDate } from 'class-validator';

export class CreateTagDto {
    @IsString({ message: 'Title in English must be a string.' })
    @IsNotEmpty({ message: 'Title in English is required.' })
    @MaxLength(255, { message: 'Title in English should not exceed 255 characters.' })
    public title_en: string;

    @IsString({ message: 'Title in Arabic must be a string.' })
    @IsNotEmpty({ message: 'Title in Arabic is required.' })
    @MaxLength(255, { message: 'Title in Arabic should not exceed 255 characters.' })
    public title_ar: string;

    @IsNumber({}, { message: 'Created by must be a valid number.' })
    @IsNotEmpty({ message: 'Created by is required.' })
    public created_by: number;

}

export class UpdateTagDto {
    @IsOptional()
    @IsString({ message: 'Title in English must be a string.' })
    @MaxLength(255, { message: 'Title in English should not exceed 255 characters.' })
    public title_en?: string;

    @IsOptional()
    @IsString({ message: 'Title in Arabic must be a string.' })
    @MaxLength(255, { message: 'Title in Arabic should not exceed 255 characters.' })
    public title_ar?: string;

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
