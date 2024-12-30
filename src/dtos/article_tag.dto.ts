import { IsNumber, IsNotEmpty, IsOptional, IsDate, IsIn } from 'class-validator';

export class CreateArticleTagDto {
    @IsNumber({}, { message: 'Article ID must be a valid number.' })
    @IsNotEmpty({ message: 'Article ID is required.' })
    public article_id: number;

    @IsNumber({}, { message: 'Tag ID must be a valid number.' })
    @IsNotEmpty({ message: 'Tag ID is required.' })
    public tag_id: number;
    
    @IsOptional()
    @IsNumber({}, { message: 'Record status must be a valid number.' })
    @IsIn([1,2,3], { message: 'Record status must be one of the following values: 1, 2, or 3.' })
    public record_status?: number;
}

export class UpdateArticleTagDto {
    @IsOptional()
    @IsNumber({}, { message: 'Tag ID must be a valid number.' })
    @IsNotEmpty({ message: 'Tag ID is required.' })
    public tag_id?: number;

    @IsOptional()
    @IsNumber({}, { message: 'Record status must be a valid number.' })
    @IsIn([1,2,3], { message: 'Record status must be one of the following values: 1, 2, or 3.' })
    public record_status?: number;
}
