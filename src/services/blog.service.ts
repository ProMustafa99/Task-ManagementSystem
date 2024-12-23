import { DB } from '@/database';
import { HttpException } from '@/exceptions/httpException';
import { Blog } from '@/interfaces/blog.interface';
import { Service } from 'typedi';
import sequelize, { Op, where } from 'sequelize';
import { CreateBlogDto, UpdateBlogDto } from '@/dtos/blog.dto';


@Service()
export class BlogService {

    public async getAllBlog(pageNumber: number): Promise<Blog[] | string> {

        const offset = (pageNumber - 1) * 15;

        const getUserName = (field: string) =>
            sequelize.literal(`(SELECT user_name FROM User WHERE User.uid = BlogModel.${field})`);

        const getStatusName = () =>
            sequelize.literal(`(SELECT Name_en FROM Status WHERE Status.id = BlogModel.record_status)`);

        const allBlog: Blog[] = await DB.Blog.findAll({
            attributes: [
                'id', 'title_en', 'title_ar', 'url_en', 'url_ar',
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

        return allBlog.length ? allBlog : "There are no blogs";
    }

    public async createNewBlog(blog_data: CreateBlogDto, user_id: number): Promise<Blog> {

        const checkUrl = await DB.Blog.findAll({
            where: {
                [Op.or]: [
                    { url_en: blog_data.url_en },
                    { url_ar: blog_data.url_ar },
                ]
            }
        });

        if (checkUrl.length > 0)
            throw new HttpException(404, 'A blog with the same URL already exists');

        const create_blog: Blog = await DB.Blog.create({ ...blog_data, created_by: user_id });
        return create_blog;
    }

    public async upddateBlog(blog_id: number, blog_data: UpdateBlogDto, user_id: number): Promise<string> {
        const checkOnBlog: Blog = await DB.Blog.findByPk(blog_id);

        if (!checkOnBlog) {
            throw new HttpException(404, "Blog doesn't exist");
        }

        if (blog_data.url_ar || blog_data.url_en) {
            const checkUrl = await DB.Blog.findAll({
                where: {
                    [Op.or]: [
                        { url_en: blog_data.url_en },
                        { url_ar: blog_data.url_ar },
                    ],
                }
            });
            if (checkUrl.length > 0) {
                throw new HttpException(409, 'A blog with the same URL already exists');
            }
        }

        const udpateBlog = await DB.Blog.update(
            {
                ...blog_data,
                updated_by: user_id,
                updated_on: new Date(),
            },
            { where: { id: blog_id } }
        );

        return "The blog has been updated ";
    }

    public async deleteBlog(blog_id: number, user_id: number): Promise<Blog | string> {

        const checkOnBlog: Blog = await DB.Blog.findByPk(blog_id);

        if (!checkOnBlog)
            throw new HttpException(404, "Blog doesn't exist");

        if (checkOnBlog.record_status === 102) {
            throw new HttpException(404, "The blog is already deleted");
        }

        await DB.Blog.update({ record_status: 102, deleted_by: user_id, deleted_on: new Date() }, { where: { id: blog_id } })
            .then(async () => {
                await DB.Articl.update(
                    { record_status: 102, deleted_by: user_id, deleted_on: new Date() },
                    { where: { blog_id: blog_id } }
                );
            });

        return `The blog has been deleted ID Blog ${blog_id}`;
    }
}