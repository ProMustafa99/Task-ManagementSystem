import { DB } from '@/database';
import { Service } from 'typedi';
import { QueryTypes } from 'sequelize';
import { Article } from '@/interfaces/article.interface';
import sequelize, { Op, where } from 'sequelize';


// ###### Note Get example from Yazan

@Service()
export class SearchArticleService {

    public async SearchArticles(pageNumber: number, search_term: string): Promise<{ searchResults: Article[]; totalCount: number; currentPage: number; countPerPage: number }> {
        const sequelize = DB.sequelize;
        const limit = 15;
        const offset = (pageNumber - 1) * limit;

        const query = `
            SELECT
                article.id As Id,
                article.title_en AS article_title,
                SUBSTRING (article.description_en,1,150) AS article_description,
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
            LIMIT :limit OFFSET :offset
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
            replacements: { search_term, limit, offset },
            type: QueryTypes.SELECT,
        });

        const totalCountRow = await sequelize.query(countQuery, {
            replacements: { search_term },
            type: QueryTypes.SELECT,
        });

        const totalCount = (totalCountRow[0] as any).totalCount;
        const countPerPage = searchResults.length;

        return {
            totalCount,
            countPerPage,
            currentPage: pageNumber,
            searchResults,
        };
    }

    public async SearchArticleById(article_id: number): Promise<Article | string> {
        const getBlogName = (field: string) => sequelize.literal(`(SELECT title_en FROM blog WHERE blog.id = ArticleModel.${field})`);

        const allArticle = await DB.Article.findByPk(article_id, {
            attributes: [
                [getBlogName('blog_id'), "Blog Name"],
                'description_en',
                'description_ar',
                'in_links',
                'related_links',
                'cover_image_url',
            ],
        });

        if (!allArticle) {
            return "There are no Article";
        }

        const reg = (description: string, in_link) => {
            const reguler = /@(\w+)/g;
            const matches = description.match(reguler);
        
            if (matches) {
                matches.forEach((item) => {
                    const lowerCaseItem = item.toLowerCase();
                    if (in_link?.hasOwnProperty(lowerCaseItem)) {
                        description = description.replace(item, in_link[lowerCaseItem]);
                    }
                });
            }
            return description;
        };
        
        const dataValues = allArticle.dataValues;
        const { description_en, description_ar, in_links } = dataValues;
        
        const updatedDescriptionEn = reg(description_en, in_links[0]);
        const updatedDescriptionAr = reg(description_ar, in_links[0]);
    
        const { in_links: _, ...cleanedArticle } = dataValues;

        cleanedArticle.description_en = updatedDescriptionEn;
        cleanedArticle.description_ar = updatedDescriptionAr;
        
        return cleanedArticle;
        
    }

}    
