import { Record } from "@/interfaces/record.interface";

export interface ArticleTag extends Record{
    id: number;
    article_id: number;
    tag_id: number;
}
