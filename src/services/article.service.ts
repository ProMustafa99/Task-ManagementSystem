import { DB } from '@/database';
import { HttpException } from '@/exceptions/httpException';
import { Service } from 'typedi';
import sequelize, { Op, where } from 'sequelize';
import { Article } from '@/interfaces/article.interface';
import { CreateArticleDto, UpdateArticleDto } from '@/dtos/article.dto';


@Service()
export class ArticleService {

    public async getAllArticl(pageNumber: number): Promise<Article[] | string> {
        const articlesPerPage = 15;
        const totalArticlesCount = await DB.Article.count();
        const maxPages = Math.ceil(totalArticlesCount / articlesPerPage);
        if (pageNumber <= 0 || pageNumber > maxPages) {
            return `Invalid page number. Please provide a page number between 1 and ${maxPages}.`;
        }

        const offset = (pageNumber - 1) * articlesPerPage;

        const getUserName = (field: string) =>
            sequelize.literal(`(SELECT user_name FROM User WHERE User.uid = ArticleModel.${field})`);

        const getStatusName = () =>
            sequelize.literal(`
                CASE
                    WHEN ArticleModel.record_status = 1 THEN 'PENDING'
                    WHEN ArticleModel.record_status = 2 THEN 'ACTIVE'
                    WHEN ArticleModel.record_status = 3 THEN 'DELETED'
                    ELSE 'UNKNOWN'
                END
            `);

        const allArticle: Article[] = await DB.Article.findAll({
            attributes: [
                'id',
                'title_en',
                'title_ar',
                'url_en',
                'url_ar',
                'description_en',
                'description_ar',
                'in_links',
                'related_links',
                'cover_image_url',
                [getStatusName(), 'status'],
                [getUserName('created_by'), 'author'],
                [getUserName('updated_by'), 'updatedBy'],
                ['updated_on', "updatedOn"],
                [getUserName('deleted_by'), 'deletedBy'],
                ['deleted_on', "deletedOn"],
            ],
            offset,
            limit: articlesPerPage,
        });

        return allArticle.length ? allArticle : "There are no Articles";
    }

    public async getArticlById(article_id: number): Promise<Article | string> {

        const getUserName = (field: string) =>
            sequelize.literal(`(SELECT user_name FROM User WHERE User.uid = ArticleModel.${field})`);

        const getStatusName = () =>
            sequelize.literal(`
                CASE
                    WHEN ArticleModel.record_status = 1 THEN 'PENDING'
                    WHEN ArticleModel.record_status = 2 THEN 'ACTIVE'
                    WHEN ArticleModel.record_status = 3 THEN 'DELETED'
                    ELSE 'UNKNOWN'
                END
            `);

        const getBlogName = (field: string) =>
            sequelize.literal(`(SELECT title_en FROM blog WHERE blog.id = ArticleModel.${field})`);

        const allArticle: Article = await DB.Article.findByPk(article_id, {
            attributes: [
                'id',
                'title_en',
                'title_ar',
                'url_en',
                'url_ar',
                'description_en',
                'description_ar',
                'in_links',
                'related_links',
                'cover_image_url',
                [getBlogName('blog_id'), "Blog Name"],
                [getStatusName(), 'status'],
                [getUserName('created_by'), 'author'],
                [getUserName('updated_by'), 'updatedBy'],
                ['updated_on', "updatedOn"],
                [getUserName('deleted_by'), 'deletedBy'],
                ['deleted_on', "deletedOn"],
            ],
        });

        return allArticle ? allArticle : "There are no Article";
    }

    public async createNewArticl(article_data: CreateArticleDto, user_id: number): Promise<Article> {

        const existingBlog = await DB.Blog.findOne({
            where: {
                [Op.and]: [
                    { id: article_data.blog_id },
                    { record_status: 2 }
                ]
            }
        });


        if (!existingBlog) {
            throw new HttpException(404, "The Blog doesn't exist or is not active.");
        }


        const existingUrl = await DB.Article.findOne({
            where: {
                [Op.or]: [
                    { url_en: article_data.url_en },
                    { url_ar: article_data.url_ar }
                ]
            }
        });

        if (existingUrl) {
            if (existingUrl.url_en === article_data.url_en) {
                throw new HttpException(409, 'An Article with the same URL (English) already exists.');
            }
            if (existingUrl.url_ar === article_data.url_ar) {
                throw new HttpException(409, 'An Article with the same URL (Arabic) already exists.');
            }
        }

        const create_article: Article = await DB.Article.create({ ...article_data, created_by: user_id });
        return create_article;
    }

    public async upddateArtilce(article_id: number, article_data: UpdateArticleDto, user_id: number): Promise<string> {

        const checkOnArticle: Article = await DB.Article.findByPk(article_id);

        if (!checkOnArticle) {
            throw new HttpException(404, "Article doesn't exist");
        }

        if (article_data.url_ar || article_data.url_en) {
            const checkUrl = await DB.Article.findAll({
                where: {
                    [Op.or]: [
                        { url_en: article_data.url_en },
                        { url_ar: article_data.url_ar },
                    ],
                }
            });
            if (checkUrl.length > 0) {
                throw new HttpException(409, 'A Article with the same URL already exists');
            }
        }

        const udpateArticle = await DB.Article.update(
            {
                ...article_data,
                updated_by: user_id,
                updated_on: new Date(),
            },
            { where: { id: article_id } }
        );

        return "The Article has been updated ";
    }

    public async deleteArticle(article_id: number, user_id: number): Promise<Article | string> {

        const checkOnArticle: Article = await DB.Article.findByPk(article_id);

        if (!checkOnArticle)
            throw new HttpException(404, "Article doesn't exist");

        if (checkOnArticle.record_status === 3) {
            throw new HttpException(404, "The Article is already deleted");
        }

        await DB.Article.update({ record_status: 3, deleted_by: user_id, deleted_on: new Date() }, { where: { id: article_id } })
            .then(() => {
                // Delete the Article_tag
            });

        return `The Article has been deleted ID Article ${article_id}`;
    }
}