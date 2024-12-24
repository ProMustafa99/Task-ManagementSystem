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

    @IsOptional()
    @IsNumber()
    public record_status?: number;
    
}

