import { DB } from '@/database';
import { CreateBlogDto, UpdateBlogDto } from '@/dtos/blog.dto';
import { HttpException } from '@/exceptions/httpException';
import { Blog } from '@/interfaces/blog.interface';
import { PagenationBlog } from '@/interfaces/pagenation.interface';
import sequelize, { Op } from 'sequelize';
import { Service } from 'typedi';

@Service()
export class BlogService {


  public async getAllBlog(pageNumber: number, status: number | null, search: string | null  ): Promise<PagenationBlog> {

    const whereCondition: any = {};

    if (status !== null) {
      whereCondition.record_status = status;
    }

    if (search) {
      whereCondition.title_en = { [Op.like]: `%${search}%` };
    }

    const countPerPage = 5;

    const totalCount = status !== null || search !== null ? await DB.Blog.count({ where: whereCondition }) : await DB.Blog.count();
    
    const maxPages = Math.ceil(totalCount / countPerPage);
    
    const offset = (pageNumber - 1) * countPerPage;
    
    const getUserName = (field: string) => sequelize.literal(`(SELECT user_name FROM User WHERE User.uid = BlogModel.${field})`);

    const getStatusName = () =>
      sequelize.literal(`
                CASE
                    WHEN BlogModel.record_status = 1 THEN 'PENDING'
                    WHEN BlogModel.record_status = 2 THEN 'ACTIVE'
                    WHEN BlogModel.record_status = 3 THEN 'DELETED'
                    ELSE 'UNKNOWN'
                END
            `);

    const allBlog: Blog[] = await DB.Blog.findAll({
      attributes: [
        'id',
        'title_en',
        'title_ar',
        'url_en',
        'url_ar',
        'created_on',
        [getStatusName(), 'status'],
        [getUserName('created_by'), 'author'],
        [getUserName('updated_by'), 'updatedBy'],
        ['updated_on', 'updatedOn'],
        [getUserName('deleted_by'), 'deletedBy'],
        ['deleted_on', 'deletedOn'],
      ],
      where :whereCondition,
      raw: true,
      offset,
      limit: countPerPage,
    });

    return allBlog.length
      ? {
          data: allBlog,
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

  public async getBlogByID(id: number): Promise<Blog | string> {
      const blog: Blog = await DB.Blog.findOne({
          where: {
              id,
          },
          raw: true
      });

      if (!blog)
      throw new HttpException(404, "Blog doesn't exist");

      return blog;
  }

  public async createNewBlog(blog_data: CreateBlogDto, user_id: number): Promise<Blog> {

    console.error(`Data ----> ${blog_data}`);

    blog_data.url_en = blog_data.url_en.toLowerCase();
    blog_data.url_ar = blog_data.url_ar.toLowerCase();

    const existingUrl = await DB.Blog.findOne({
      where: {
        [Op.or]: [{ url_en: blog_data.url_en }, { url_ar: blog_data.url_ar }],
      },
    });

    if (existingUrl) {
      if (existingUrl.url_en === blog_data.url_en) {
        throw new HttpException(409, 'A Blog with the same URL (English) already exists.');
      }
      if (existingUrl.url_ar === blog_data.url_ar) {
        throw new HttpException(409, 'A Blog with the same URL (Arabic) already exists.');
      }
    }

    const create_blog: Blog = await DB.Blog.create({ ...blog_data, created_by: user_id });
    return create_blog;
  }

  public async updateBlog(blog_id: number, blog_data: UpdateBlogDto, user_id: number): Promise<string> {
    const checkOnBlog: Blog = await DB.Blog.findByPk(blog_id);

    if (!checkOnBlog) {
      throw new HttpException(404, "Blog doesn't exist");
    }

    // if (blog_data.url_ar || blog_data.url_en) {
    //   const checkUrl = await DB.Blog.findAll({
    //     where: {
    //       [Op.or]: [{ url_en: blog_data.url_en }, { url_ar: blog_data.url_ar }],
    //     },
    //   });
    //   if (checkUrl.length > 0) {
    //     throw new HttpException(409, 'A blog with the same URL already exists');
    //   }
    // }

    const udpateBlog = await DB.Blog.update(
      {
        ...blog_data,
        updated_by: user_id,
        updated_on: new Date(),
      },
      { where: { id: blog_id } }
    );

    if (blog_data.record_status === 1) {
      var res = await DB.Article.update(
        { record_status: blog_data.record_status, updated_by: user_id, updated_on: new Date() },
        { where: { blog_id: blog_id } }
      );
    } else if (blog_data.record_status === 3) {
      throw new HttpException(400, "Can't delete blog by updating it");
    }

    return "The blog has been updated ";
  }

  public async deleteBlog(blog_id: number, user_id: number): Promise<Blog | string> {
    const checkOnBlog: Blog = await DB.Blog.findByPk(blog_id);

    if (!checkOnBlog) throw new HttpException(404, "Blog doesn't exist");

    if (checkOnBlog.record_status === 3) {
      throw new HttpException(404, 'The blog is already deleted');
    }

    await DB.Blog.update({ record_status: 3, deleted_by: user_id, deleted_on: new Date() }, { where: { id: blog_id } }).then(async () => {
      await DB.Article.update({ record_status: 3, deleted_by: user_id, deleted_on: new Date() }, { where: { blog_id: blog_id } });
    });

    return `The blog has been deleted ID Blog ${blog_id}`;
  }
}
