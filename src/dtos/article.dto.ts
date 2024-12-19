import { IsString, IsOptional, IsNumber, IsArray, IsUrl, IsDate, MaxLength, IsNotEmpty } from 'class-validator';

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

    @IsString({ message: 'URL in English must be a string.' })
    @IsNotEmpty({ message: 'URL in English is required.' })
    @MaxLength(255, { message: 'URL in English should not exceed 255 characters.' })
    public url_en: string;

    @IsString({ message: 'URL in Arabic must be a string.' })
    @IsNotEmpty({ message: 'URL in Arabic is required.' })
    @MaxLength(255, { message: 'URL in Arabic should not exceed 255 characters.' })
    public url_ar: string;

    @IsString({ message: 'Description in English must be a string.' })
    @IsNotEmpty({ message: 'Description in English is required.' })
    public description_en: string;

    @IsString({ message: 'Description in Arabic must be a string.' })
    @IsNotEmpty({ message: 'Description in Arabic is required.' })
    public description_ar: string;

    @IsOptional()
    @IsArray({ message: 'In links should be an array of strings.' })
    @IsString({ each: true, message: 'Each in link should be a string.' })
    public in_links?: string[];

    @IsOptional()
    @IsArray({ message: 'Related links should be an array of strings.' })
    @IsString({ each: true, message: 'Each related link should be a string.' })
    public related_links?: string[];

    @IsUrl({}, { message: 'Cover image URL must be a valid URL.' })
    @IsNotEmpty({ message: 'Cover image URL is required.' })
    public cover_image_url: string;
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
    @IsString({ message: 'URL in English must be a string.' })
    @MaxLength(255, { message: 'URL in English should not exceed 255 characters.' })
    public url_en?: string;

    @IsOptional()
    @IsString({ message: 'URL in Arabic must be a string.' })
    @MaxLength(255, { message: 'URL in Arabic should not exceed 255 characters.' })
    public url_ar?: string;

    @IsOptional()
    @IsString({ message: 'Description in English must be a string.' })
    public description_en?: string;

    @IsOptional()
    @IsString({ message: 'Description in Arabic must be a string.' })
    public description_ar?: string;

    @IsOptional()
    @IsArray({ message: 'In links should be an array of strings.' })
    @IsString({ each: true, message: 'Each in link should be a string.' })
    public in_links?: string[];

    @IsOptional()
    @IsArray({ message: 'Related links should be an array of strings.' })
    @IsString({ each: true, message: 'Each related link should be a string.' })
    public related_links?: string[];

    @IsOptional()
    @IsUrl({}, { message: 'Cover image URL must be a valid URL.' })
    public cover_image_url?: string;
}
