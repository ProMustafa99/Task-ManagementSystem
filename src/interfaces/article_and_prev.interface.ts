import { Article } from "./article.interface";
import { RelatedArticle } from "./related_article.interface";

export interface ArticleAndPrevious {
    article: Article;
    prevArticles: RelatedArticle;
    nextArticles: RelatedArticle;
}