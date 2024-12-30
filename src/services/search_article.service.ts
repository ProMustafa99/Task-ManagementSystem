import { DB } from '@/database';
import { Service } from 'typedi';
import { QueryTypes } from 'sequelize';
import { Article } from '@/interfaces/article.interface';
import sequelize, { Op, where } from 'sequelize';

@Service()
export class SearchArticleService {

    private description_en: string;
    private description_ar: string;
    private in_link: any;
    private updatedDescriptionEn: string;
    private updatedDescriptionAr: string;
    
    private replaceLinksInDescription = (description: string, in_link) => {
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
    }

    public async SearchArticles(pageNumber: number, search_term: string): Promise<{ searchResults: Article[]; totalCount: number; currentPage: number; countPerPage: number }> {
        const sequelize = DB.sequelize;
        const limit = 15;
        const offset = (pageNumber - 1) * limit;

        const query = search_term ? `
            SELECT
                article.id,
                article.title_en,
                article.in_links,
                SUBSTRING (article.description_en,1,150) AS description_en,
                SUBSTRING (article.description_ar,1,150) AS description_ar,
                article.cover_image_url,
                GROUP_CONCAT(tag.title_en) AS tags
            FROM article
            JOIN blog ON blog.id = article.blog_id
            LEFT JOIN article_tags ON article_tags.article_id = article.id AND  article_tags.record_status =2
            LEFT JOIN tag ON tag.id = article_tags.tag_id
            WHERE
                (
                MATCH (article.title_en, article.description_en) AGAINST (:search_term IN BOOLEAN MODE)
                OR MATCH (blog.title_en) AGAINST (:search_term IN BOOLEAN MODE)
                OR MATCH (tag.title_en) AGAINST (:search_term IN BOOLEAN MODE)
                ) AND article.record_status = 2 
            GROUP BY article.id
            LIMIT :limit OFFSET :offset
        ` : `
            SELECT
                article.id,
                article.title_en,
                article.in_links,
                SUBSTRING (article.description_en,1,150) AS description_en,
                SUBSTRING (article.description_ar,1,150) AS description_ar,
                article.cover_image_url,
                GROUP_CONCAT(tag.title_en) AS tags
            FROM article
            JOIN blog ON blog.id = article.blog_id
            LEFT JOIN article_tags ON article_tags.article_id = article.id
            LEFT JOIN tag ON tag.id = article_tags.tag_id
            WHERE article.record_status = 2
            GROUP BY article.id
            LIMIT :limit OFFSET :offset
        `;

        const countQuery = search_term ? `
            SELECT COUNT(DISTINCT article.id) AS totalCount
            FROM article
            JOIN blog ON blog.id = article.blog_id
            LEFT JOIN article_tags ON article_tags.article_id = article.id
            LEFT JOIN tag ON tag.id = article_tags.tag_id
            WHERE
                (
                MATCH (article.title_en, article.description_en) AGAINST (:search_term IN BOOLEAN MODE)
                OR MATCH (blog.title_en) AGAINST (:search_term IN BOOLEAN MODE)
                OR MATCH (tag.title_en) AGAINST (:search_term IN BOOLEAN MODE)
                ) AND article.record_status = 2;
        ` : `
            SELECT COUNT(DISTINCT article.id) AS totalCount
            FROM article
            WHERE article.record_status = 2;
        `;

        const searchResults: Article[] = await sequelize.query(query, {
            replacements: { search_term, limit, offset },
            type: QueryTypes.SELECT,
        });

        const totalCountRow = await sequelize.query(countQuery, {
            replacements: { search_term },
            type: QueryTypes.SELECT,
        });

        searchResults.map((dataValues, index) => {
            const description_en = dataValues.description_en;
            const description_ar = dataValues.description_ar;
            const in_link = dataValues.in_links;

            this.updatedDescriptionEn = this.replaceLinksInDescription(description_en, in_link[0]);
            this.updatedDescriptionAr = this.replaceLinksInDescription(description_ar, in_link[0]);

            searchResults[index].description_en = this.updatedDescriptionEn;
            searchResults[index].description_ar = this.updatedDescriptionAr;

            delete searchResults[index].in_links;
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

        const allArticle = await DB.Article.findOne({
            attributes: [
                [getBlogName('blog_id'), 'Blog Name'],
                'description_en',
                'description_ar',
                'in_links',
                'related_links',
                'cover_image_url',
            ],
            where: {
                id: article_id,
                record_status: 2
            },
        });

        if (!allArticle) {
            return "There are no Article";
        }

        const dataValues = allArticle.dataValues;
        this.description_en = dataValues.description_en;
        this.description_ar = dataValues.description_ar;
        this.in_link = dataValues.in_links[0];

        this.updatedDescriptionEn = this.replaceLinksInDescription(this.description_en, this.in_link);
        this.updatedDescriptionAr = this.replaceLinksInDescription(this.description_ar, this.in_link);

        dataValues.description_en = this.updatedDescriptionEn;
        dataValues.description_ar = this.updatedDescriptionAr;
        delete dataValues.in_links;

        return dataValues;

    }
}    
