import { DB } from '@/database';
import { HttpException } from '@/exceptions/httpException';
import { Service } from 'typedi';
import sequelize, { Op, where } from 'sequelize';
import { ArticleTag } from '@/interfaces/article_tag.interface';
import { ArticleTagModel } from '@/models/article_tags.model';
import { CreateArticleTagDto } from '@/dtos/article_tag.dto';

@Service()
export class ArticleTagsService {

    public async getTagByArticleId(article_id: number, pageNumber: number): Promise<ArticleTagModel[] | string> {

        const existingArticle = await DB.Article.findOne({
            where:{
                [Op.and]:[
                    {id:article_id},
                    {record_status:2}
                ]
            }
        });


        if (!existingArticle) {
            throw new HttpException(404, "Article doesn't exist");
        }

        const offset = (pageNumber - 1) * 15;

        const getUserName = (field: string) =>
            sequelize.literal(`(SELECT user_name FROM User WHERE User.uid = ArticleTagModel.${field})`);

        const getStatusName = () =>
            sequelize.literal(`
                CASE
                    WHEN ArticleTagModel.record_status = 1 THEN 'PENDING'
                    WHEN ArticleTagModel.record_status = 2 THEN 'ACTIVE'
                    WHEN ArticleTagModel.record_status = 3 THEN 'DELETED'
                    ELSE 'UNKNOWN'
                END
            `);;

        const allTag: ArticleTagModel[] = await DB.ArticleTag.findAll({
            attributes: [
                'id',
                'article_id',
                'tag_id',
                [getStatusName(), 'status'],
                [getUserName('created_by'), 'author'],
                [getUserName('updated_by'), 'updatedBy'],
                ['updated_on', "updatedOn"],
                [getUserName('deleted_by'), 'deletedBy'],
                ['deleted_on', "deletedOn"],
            ],
            offset,
            limit: 15,
            where: {
                article_id: article_id
            }
        });

        return allTag.length ? allTag : "There are no Tags";
    }

    public async createNewTagsForArticle(article_id: number, tag_id: number, article_tag_data: CreateArticleTagDto, user_id: number): Promise<ArticleTagModel> {

        const checkOnArticle = await DB.Article.findOne({
            where: {
                [Op.and]: [
                    { id: article_id },
                    { record_status: 2 }
                ]
            }
        });

        const checkOnTag = await DB.Tag.findOne({
            where:{
                [Op.and]:[
                    {id:tag_id},
                    {record_status:2}
                ]
            }
        });

        if (!checkOnArticle)
            throw new HttpException(404, "Article doesn't exist");

        if (!checkOnTag)
            throw new HttpException(404, "Tag doesn't exist");

        const create_tagsforAtricle: ArticleTagModel = await DB.ArticleTag.create({ ...article_tag_data, created_by: user_id });
        return create_tagsforAtricle;
    }

    public async deleteTagsFormArticle(article_id: number, tag_id: number, user_id: number): Promise<ArticleTagModel | string> {


        const existingArticle: ArticleTag = await DB.ArticleTag.findOne({
            where: {
                article_id: article_id,
            }
        });
        const existingTag: ArticleTag = await DB.ArticleTag.findOne({
            where: {
                tag_id: tag_id,
            }
        });

        if (!existingArticle)
            throw new HttpException(404, "Article doesn't exist");

        if (!existingTag)
            throw new HttpException(404, "Tag doesn't exist");

        if (existingTag.record_status === 3) {
            throw new HttpException(404, "The Tag is already deleted");
        }

        await DB.ArticleTag.update({ record_status: 3, deleted_by: user_id, deleted_on: new Date() }, { where: { tag_id: tag_id } })

        return `The Tag has been deleted ID Tag ${tag_id}`;
    }
}