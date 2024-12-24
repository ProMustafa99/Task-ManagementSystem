import { DB } from '@/database';
import { Service } from 'typedi';
import { QueryTypes } from 'sequelize';
import { Article } from '@/interfaces/article.interface';

// Note give Ex from Yazan

@Service()
export class SearchArticleService {

    public async SearchArticle(pageNumber: number, search_term: string): Promise<{ searchResults: Article[]; totalCount: number; currentPage: number; countPerPage: number; countForPage: number }> {
        const sequelize = DB.sequelize;
        const countPerPage = 15;
        const offset = (pageNumber - 1) * countPerPage;

        const query = `
            SELECT
                article.title_en AS article_title,
                article.description_en AS article_description,
                article.cover_image_url AS cover_image_url,
                GROUP_CONCAT(tag.title_en) AS tags
            FROM article
            JOIN blog ON blog.id = article.blog_id
            LEFT JOIN article_tags ON article_tags.article_id = article.id
            LEFT JOIN tag ON tag.id = article_tags.tag_id
            WHERE
                MATCH (article.title_en, article.description_en) AGAINST (:search_term IN BOOLEAN MODE)
                OR MATCH (blog.title_en) AGAINST (:search_term IN BOOLEAN MODE)
                OR MATCH (tag.title_en) AGAINST (:search_term IN BOOLEAN MODE)
            GROUP BY article.id
            LIMIT :countPerPage OFFSET :offset
        `;

        const countQuery = `
            SELECT COUNT(DISTINCT article.id) AS totalCount
            FROM article
            JOIN blog ON blog.id = article.blog_id
            LEFT JOIN article_tags ON article_tags.article_id = article.id
            LEFT JOIN tag ON tag.id = article_tags.tag_id
            WHERE
                MATCH (article.title_en, article.description_en) AGAINST (:search_term IN BOOLEAN MODE)
                OR MATCH (blog.title_en) AGAINST (:search_term IN BOOLEAN MODE)
                OR MATCH (tag.title_en) AGAINST (:search_term IN BOOLEAN MODE);
        `;

        const searchResults: Article[] = await sequelize.query(query, {
            replacements: { search_term, countPerPage, offset },
            type: QueryTypes.SELECT,
        });

        const totalCountRow = await sequelize.query(countQuery, {
            replacements: { search_term },
            type: QueryTypes.SELECT,
        });

        const totalCount = (totalCountRow[0] as any).totalCount;
        const countForPage = searchResults.length;

        return {
            totalCount,
            countPerPage,
            countForPage,
            currentPage: pageNumber,
            searchResults,
        };
    }
}
