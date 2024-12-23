import { Container } from 'typedi';
import { PostService } from '@services/posts.service';
import { Request, Response, NextFunction } from 'express';
import { Post } from "@/interfaces/post.interface";
import { CreatePostDto, UpdatePostDto } from '@/dtos/posts.dto';
import { registerSchema } from 'class-validator';
import { json } from 'sequelize';
import { Console } from 'console';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { BlogService } from '@/services/blog.service';
import { Blog } from '@/interfaces/blog.interface';
import { CreateBlogDto, UpdateBlogDto } from '@/dtos/blog.dto';

export class Blogcotroller {
    public blogService = Container.get(BlogService);

    public getAllBlogs = async (req: Request, res: Response, next: NextFunction) => {

        try {
            const page_number = Number(req.query.page) || 1;
            const findAllPost: Blog[] | string = await this.blogService.getAllBlog(page_number);
            res.status(200).json({ data: findAllPost });
        }
        catch (error) {
            next(error);
        }
    };

    public createNewblog = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {

            const blog_data: CreateBlogDto = req.body;
            const user_id = Number(req.user.uid);
            console.log(user_id);
            const newBlog = await this.blogService.createNewBlog(blog_data, user_id);
            res.status(200).json({ data: newBlog });
        }
        catch (error) {
            next(error);
        }
    }

    public updateblog = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const blog_data: UpdateBlogDto = req.body;
            const user_id = Number(req.user.uid);
            const blog_id = Number(req.params.id);
            const udpateBlog = await this.blogService.upddateBlog(blog_id, blog_data, user_id);
            res.status(200).json({ message: udpateBlog });
        } 
        catch (error) {
            next(error);
            console.error(`Error ${error}`);
        }
    };

    public deleteblog = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const user_id = Number(req.user.uid);
            const blog_id = Number(req.params.id);
            const deleteBlog = await this.blogService.deleteBlog(blog_id,user_id);
            res.status(200).json({ message: deleteBlog });
        } 
        catch (error) {
            next(error);
            console.error(`Error ${error}`);
        }
    };
}