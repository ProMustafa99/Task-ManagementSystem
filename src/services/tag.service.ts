import { DB } from '@/database';
import { HttpException } from '@/exceptions/httpException';
import { Blog } from '@/interfaces/blog.interface';
import { Service } from 'typedi';
import sequelize, { Op, where } from 'sequelize';
import { CreateTagDto } from '@/dtos/tag.dto';
import { Tags } from '@/interfaces/tags.interface';
import { Tag } from 'swagger-jsdoc';
import { toTitleCase } from '@/utils/functions';


@Service()
export class TagService {

    public async getAllTag(pageNumber: number): Promise<Tags[] | string> {

        const offset = (pageNumber - 1) * 15;

        const getUserName = (field: string) =>
            sequelize.literal(`(SELECT user_name FROM User WHERE User.uid = TagModel.${field})`);

        const getStatusName = () =>
            sequelize.literal(`
                CASE
                    WHEN TagModel.record_status = 1 THEN 'PENDING'
                    WHEN TagModel.record_status = 2 THEN 'ACTIVE'
                    WHEN TagModel.record_status = 3 THEN 'DELETED'
                    ELSE 'UNKNOWN'
                END
            `);
        
        var allTag: Tags[] = await DB.Tag.findAll({
            attributes: [
                'id',
                'title_en',
                'title_ar',
                [getStatusName(), 'status'],
                [getUserName('created_by'), 'author'],
                [getUserName('updated_by'), 'updatedBy'],
                ['updated_on', "updatedOn"],
                [getUserName('deleted_by'), 'deletedBy'],
                ['deleted_on', "deletedOn"],
            ],
            where: {
                record_status: 2,
            },
            raw: true,
            offset,
            limit: 15,
        });
        
        allTag = allTag.map((tag) => ({
            ...tag,
            "title_en_case": toTitleCase(tag.title_en),
            "title_ar_case": toTitleCase(tag.title_ar)
        }));

        return allTag.length ? allTag : "There are no Tags";
    }

    public async createNewTag(tag_data: CreateTagDto, user_id: number): Promise<Tags> {

        tag_data.title_en = tag_data.title_en.toLowerCase();
        tag_data.title_ar = tag_data.title_ar.toLowerCase();

        const existingTag = await DB.Tag.findOne({
            where: {
                [Op.or]: [
                    { title_en: tag_data.title_en },
                    { title_ar: tag_data.title_ar }
                ]
            }
        });

        if (existingTag) {
            if (existingTag.title_en === tag_data.title_en) {
                throw new HttpException(409, 'A Tag with the same Title (English) already exists.');
            }
            if (existingTag.title_ar === tag_data.title_ar) {
                throw new HttpException(409, 'A Tag with the same Title (Arabic) already exists.');
            }
        }


        const create_tag: Tags = await DB.Tag.create({ ...tag_data, created_by: user_id });
        return create_tag;
    }

    public async getActiveTags(): Promise<Tags[]> {
        const tags: Tags[] = await DB.Tag.findAll({
            where: {
                record_status: 2,
            }
        });

        return tags;
    }

    public async deleteTag(tag_id: number, user_id: number): Promise<Tags | string> {

        const checkOnTag: Tags = await DB.Tag.findByPk(tag_id);

        if (!checkOnTag)
            throw new HttpException(404, "Tag doesn't exist");

        if (checkOnTag.record_status === 3) {
            throw new HttpException(404, "The Tag is already deleted");
        }

        await DB.Tag.update({ record_status: 3, deleted_by: user_id, deleted_on: new Date() }, { where: { id: tag_id } })
            .then(() => {
                // Delete the 
            });

        return `The Tag has been deleted ID Tag ${tag_id}`;
    }
}