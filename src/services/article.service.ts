import { DB } from '@/database';
import { HttpException } from '@/exceptions/httpException';
import { Service } from 'typedi';
import sequelize, { Op, where } from 'sequelize';
import { Article } from '@/interfaces/article.interface';
import { CreateArticleDto, UpdateArticleDto } from '@/dtos/article.dto';
import { Http } from 'winston/lib/winston/transports';
import { Blog } from '@/interfaces/blog.interface';
import { check } from 'prettier';
import { ArticleWithTags, TagItem } from '@/interfaces/article_with_tags.interface';
import { TagModel } from '@/models/tag.model';


@Service()
export class ArticleService {

    public async getAllArticl(pageNumber: number): Promise<Article[] | string> {

        const offset = (pageNumber - 1) * 15;

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
            `);;

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
            limit: 15,
        });
        return allArticle.length ? allArticle : "There are no Article";
    }

    public async getArticlById(article_id: number): Promise<ArticleWithTags | string> {

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
            raw: true
        });

        const articleTagIds = await DB.ArticleTag.findAll({
            where: {
                article_id,
                record_status: 2
            },
            raw: true
        });

        console.log("\n\n\n\n\nArticle id: ", articleTagIds);

        const articleTags : TagModel[] = await Promise.all(articleTagIds.map(tag => {
            return DB.Tag.findOne({
                attributes: [
                    'title_en',
                    'id'
                ],
                where: {
                    id: tag.tag_id,
                    record_status: 2
                },
                raw: true
            })
        }));

        console.log("\n\n\n\n\nArticle id: ", articleTags);

        const tags : TagItem[] = articleTags.map(tag => {return {label: tag.title_en, value: tag.id}});

        if (!allArticle) 
            throw new HttpException(404, "Article doesn't exist");

        return {...allArticle, tags};
    }

    public async createNewArticl(article_data: CreateArticleDto, user_id: number): Promise<Article> {

        const existingBlog = await DB.Blog.findOne({
            where: {
                [Op.and]: [
                    { id: article_data.blog_id },
                    { record_status: 2 }
                ]
            },
        });


        if (!existingBlog) {
            throw new HttpException(404, "The Blog doesn't exist or is not active.");
        }

        article_data.url_en = article_data.url_en.toLowerCase();
        article_data.url_ar = article_data.url_ar.toLowerCase();

        const regular = /@(\w+)/g;
        const matches_en = article_data.description_en.match(regular);
        const matches_ar = article_data.description_ar.match(regular);

        if (Array.isArray(article_data.in_links)) {
            throw new HttpException(400, "In links should be a json object")
        }

        var inLinks = {};

        if (matches_en)
        matches_en.map((match) => {
            if (article_data.in_links[match]) {
                inLinks[match] = article_data.in_links[match]
            }
        });

        if (matches_ar)
        matches_ar.map((match) => {
            if (article_data.in_links[match]) {
                inLinks[match] = article_data.in_links[match]
            }
        });

        delete article_data.in_links;

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

        const create_article: Article = await DB.Article.create({ ...article_data, in_links: inLinks, created_by: user_id });
        return create_article;
    }

    public async upddateArtilce(article_id: number, article_data: UpdateArticleDto, user_id: number): Promise<string> {

        
        const checkOnArticle: Article = await DB.Article.findByPk(article_id);

        if (article_data.record_status) {
            const checkOnBlog : Blog = await DB.Blog.findByPk(checkOnArticle.blog_id);

            if (checkOnBlog.record_status !== 2 && !(checkOnBlog.record_status === 1 && article_data.record_status === 3)) {
                throw new HttpException(406, "Cannot change article's record status if blog is not active");
            }

        }

        if (!checkOnArticle) {
            throw new HttpException(404, "Article doesn't exist");
        }

        const regular = /@(\w+)/g;
        var desc_en;
        var desc_ar;

        if (article_data.description_en) {
            desc_en = article_data.description_en;
        } else {
            desc_en = checkOnArticle.description_en
        }

        if (article_data.description_ar) {
            desc_ar = article_data.description_ar;
        } else {
            desc_ar = checkOnArticle.description_ar
        }

        const matches_en = desc_en.match(regular);
        const matches_ar = desc_ar.match(regular);
        
        var inLinks = {};

        if (article_data.in_links) {

            matches_en.map((match) => {
                if (article_data.in_links[match]) {
                    inLinks[match] = article_data.in_links[match]
                }
            });
            
            matches_ar.map((match) => {
                if (article_data.in_links[match]) {
                    inLinks[match] = article_data.in_links[match]
                }
            });
            
        } else {
            inLinks = checkOnArticle.in_links;
        }

        delete article_data.in_links;

        if (article_data.url_ar || article_data.url_en) {
    
            article_data.url_en = article_data.url_en.toLowerCase();
            article_data.url_ar = article_data.url_ar.toLowerCase();

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
                in_links: inLinks,
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