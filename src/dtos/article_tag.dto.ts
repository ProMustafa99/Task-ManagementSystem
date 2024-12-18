import { IsNumber, IsNotEmpty, IsOptional, IsDate } from 'class-validator';

export class CreateArticleTagDto {
    @IsNumber({}, { message: 'Article ID must be a valid number.' })
    @IsNotEmpty({ message: 'Article ID is required.' })
    public article_id: number;

    @IsNumber({}, { message: 'Tag ID must be a valid number.' })
    @IsNotEmpty({ message: 'Tag ID is required.' })
    public tag_id: number;
}

export class UpdateArticleTagDto {
    @IsOptional()
    @IsNumber({}, { message: 'Tag ID must be a valid number.' })
    public tag_id?: number;
}
