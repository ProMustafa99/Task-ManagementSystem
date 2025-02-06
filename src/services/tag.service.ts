import { DB } from '@/database';
import { CreateTagDto } from '@/dtos/tag.dto';
import { HttpException } from '@/exceptions/httpException';
import { PagenationTags } from '@/interfaces/pagenation.interface';
import { Tags } from '@/interfaces/tags.interface';
import sequelize, { Op } from 'sequelize';
import { Service } from 'typedi';

@Service()
export class TagService {
  public async getAllTag(pageNumber: number, status: number | null, search: string | null): Promise<PagenationTags> {
    const whereCondition: any = {};

    if (status !== null) {
      whereCondition.record_status = status;
    }

    if (search) {
      whereCondition.title_en = { [Op.like]: `%${search}%` };
    }

    const countPerPage = 5;

    const totalCount = status !== null || search !== null ? await DB.Tag.count({ where: whereCondition }) : await DB.Tag.count();

    const maxPages = Math.ceil(totalCount / countPerPage);

    const offset = (pageNumber - 1) * countPerPage;

    const getUserName = (field: string) => sequelize.literal(`(SELECT user_name FROM User WHERE User.uid = TagModel.${field})`);

    const getStatusName = () =>
      sequelize.literal(`
                CASE
                    WHEN TagModel.record_status = 1 THEN 'PENDING'
                    WHEN TagModel.record_status = 2 THEN 'ACTIVE'
                    WHEN TagModel.record_status = 3 THEN 'DELETED'
                    ELSE 'UNKNOWN'
                END
            `);

    const allTag: Tags[] = await DB.Tag.findAll({
      attributes: [
        'id',
        'title_en',
        'title_ar',
        'created_on',
        [getStatusName(), 'status'],
        [getUserName('created_by'), 'author'],
        [getUserName('updated_by'), 'updatedBy'],
        ['updated_on', 'updatedOn'],
        [getUserName('deleted_by'), 'deletedBy'],
        ['deleted_on', 'deletedOn'],
      ],
      where: whereCondition,
      offset,
      limit: countPerPage,
    });

    return allTag.length
      ? {
          data: allTag,
          countPerPage,
          totalCount,
          maxPages,
        }
      : {
          data: 'Not Found',
          countPerPage,
          totalCount,
          maxPages,
        };
  }

  public async createNewTag(tag_data: CreateTagDto, user_id: number) {
    tag_data.title_en = tag_data.title_en.toLowerCase();
    tag_data.title_ar = tag_data.title_ar.toLowerCase();

    const existingTag = await DB.Tag.findOne({
      raw: true,
      where: {
        [Op.or]: [{ title_en: tag_data.title_en }, { title_ar: tag_data.title_ar }],
      },
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

  public async deleteTag(tag_id: number, user_id: number): Promise<Tags | string> {
    const checkOnTag: Tags = await DB.Tag.findByPk(tag_id);

    if (!checkOnTag) throw new HttpException(404, "Tag doesn't exist");

    if (checkOnTag.record_status === 3) {
      throw new HttpException(404, 'The Tag is already deleted');
    }

    await DB.Tag.update({ record_status: 3, deleted_by: user_id, deleted_on: new Date() }, { where: { id: tag_id } }).then(async () => {
      await DB.ArticleTag.update({ record_status: 3, deleted_by: user_id, deleted_on: new Date() }, { where: { tag_id: tag_id } });
    });

    return `The Tag has been deleted ID Tag ${tag_id}`;
  }
}
