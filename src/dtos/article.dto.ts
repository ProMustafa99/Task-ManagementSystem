import { IsString, IsOptional, IsNumber, IsArray, IsUrl, MaxLength, IsNotEmpty, IsIn, IsObject } from 'class-validator';

export class CreateArticleDto {
    @IsNumber({}, { message: 'Blog ID must be a valid number.' })
    @IsNotEmpty({ message: 'Blog ID is required.' })
    public blog_id: number;

    @IsString({ message: 'Title in English must be a string.' })
    @IsNotEmpty({ message: 'Title in English is required.' })
    @MaxLength(255, { message: 'Title in English should not exceed 255 characters.' })
    public title_en: string;

    @IsString({ message: 'Title in Arabic must be a string.' })
    @IsNotEmpty({ message: 'Title in Arabic is required.' })
    @MaxLength(255, { message: 'Title in Arabic should not exceed 255 characters.' })
    public title_ar: string;

    @IsNotEmpty({ message: 'URL in English is required.' })
    @MaxLength(255, { message: 'URL in English should not exceed 255 characters.' })
    @IsString({ message: 'The Url in English must be a string.' })
    public url_en: string;

    @IsNotEmpty({ message: 'URL in Arabic is required.' })
    @MaxLength(255, { message: 'URL in Arabic should not exceed 255 characters.' })
    @IsString({ message: 'The Url in Arabic must be a string.' })
    public url_ar: string;

    @IsString({ message: 'Description in English must be a string.' })
    @IsNotEmpty({ message: 'Description in English is required.' })
    public description_en: string;

    @IsString({ message: 'Description in Arabic must be a string.' })
    @IsNotEmpty({ message: 'Description in Arabic is required.' })
    public description_ar: string;

    @IsOptional()
    @IsArray({ message: 'In links should be an array of strings.' })
    @IsObject({ each: true, message: 'Each in link should be an object.' })
    public in_links?: Record<string, string>[];

    @IsOptional()
    @IsArray({ message: 'Related links should be an array of strings.' })
    @IsObject({ each: true, message: 'Each in link should be an object.' })
    public related_links?: Record<string, string>[];

    @IsUrl({}, { message: 'Cover image URL must be a valid URL.' })
    @IsNotEmpty({ message: 'Cover image URL is required.' })
    public cover_image_url: string;

    @IsOptional()
    @IsNumber({}, { message: 'Record status must be a valid number.' })
    @IsIn([1,2,3], { message: 'Record status must be one of the following values: 1, 2, or 3.' })
    public record_status?: number;
}

export class UpdateArticleDto {
    @IsOptional()
    @IsNumber({}, { message: 'Blog ID must be a valid number.' })
    public blog_id?: number;

    @IsOptional()
    @IsString({ message: 'Title in English must be a string.' })
    @MaxLength(255, { message: 'Title in English should not exceed 255 characters.' })
    public title_en?: string;

    @IsOptional()
    @IsString({ message: 'Title in Arabic must be a string.' })
    @MaxLength(255, { message: 'Title in Arabic should not exceed 255 characters.' })
    public title_ar?: string;

    @IsOptional()
    @IsUrl({ require_protocol: true }, { message: 'URL in English must be a valid URL format with a protocol.' })
    public url_en?: string;

    @IsOptional()
    @IsUrl({ require_protocol: true }, { message: 'URL in Arabic must be a valid URL format with a protocol.' })
    public url_ar?: string;

    @IsOptional()
    @IsString({ message: 'Description in English must be a string.' })
    public description_en?: string;

    @IsOptional()
    @IsString({ message: 'Description in Arabic must be a string.' })
    public description_ar?: string;

    @IsOptional()
    @IsArray({ message: 'In links should be an array of strings.' })
    @IsObject({ each: true, message: 'Each in link should be an object.' })
    public in_links?: Record<string, string>[];

    @IsOptional()
    @IsArray({ message: 'Related links should be an array of strings.' })
    @IsObject({ each: true, message: 'Each in link should be an object.' })
    public related_links?: Record<string, string>[];

    @IsOptional()
    @IsUrl({}, { message: 'Cover image URL must be a valid URL.' })
    public cover_image_url?: string;

    
    @IsOptional()
    @IsNumber({}, { message: 'Record status must be a valid number.' })
    @IsIn([1,2,3], { message: 'Record status must be one of the following values: 1, 2, or 3.' })
    public record_status?: number;
}
