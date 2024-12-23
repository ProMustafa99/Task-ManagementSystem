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
import { TagService } from '@/services/tag.service';
import { Tags } from '@/interfaces/tags.interface';
import { CreateTagDto } from '@/dtos/tag.dto';
import { ArticleService } from '@/services/article.service';
import { Article } from '@/interfaces/article.interface';
import { CreateArticleDto, UpdateArticleDto } from '@/dtos/article.dto';

export class BlogMangmentcotroller {

    public blogService = Container.get(BlogService);
    public tagService = Container.get(TagService);
    public articleService = Container.get(ArticleService);


    // Blog Controller

    public getAllBlogs = async (req: Request, res: Response, next: NextFunction) => {

        try {
            const page_number = Number(req.query.page) || 1;
            const findAllBlog: Blog[] | string = await this.blogService.getAllBlog(page_number);
            res.status(200).json({ data: findAllBlog });
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

    public updateBlog = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const blog_data: UpdateBlogDto = req.body;
            const user_id = Number(req.user.uid);
            const blog_id = Number(req.params.id);
            const udpateBlog = await this.blogService.upddateBlog(blog_id, blog_data, user_id);
            res.status(200).json({ message: udpateBlog });
        }
        catch (error) {
            next(error);
        }
    };

    public deleteBlog = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const user_id = Number(req.user.uid);
            const blog_id = Number(req.params.id);
            const deleteBlog = await this.blogService.deleteBlog(blog_id, user_id);
            res.status(200).json({ message: deleteBlog });
        }
        catch (error) {
            next(error);
            console.error(`Error ${error}`);
        }
    };

    // Tags Controller

    public getAllTags = async (req: Request, res: Response, next: NextFunction) => {

        try {
            const page_number = Number(req.query.page) || 1;
            const findAlltags: Tags[] | string = await this.tagService.getAllTag(page_number);
            res.status(200).json({ data: findAlltags });
        }
        catch (error) {
            next(error);
        }
    };

    public createNewbTag = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {

            const tag_data: CreateTagDto = req.body;
            const user_id = Number(req.user.uid);
            const newTag = await this.tagService.createNewTag(tag_data, user_id);
            res.status(200).json({ data: newTag });
        }
        catch (error) {
            next(error);
        }
    }

    public deleteTag = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const user_id = Number(req.user.uid);
            const tag_id = Number(req.params.id);
            const deletetag = await this.tagService.deleteTag(tag_id, user_id);
            res.status(200).json({ message: deletetag });
        }
        catch (error) {
            next(error);
            console.error(`Error ${error}`);
        }
    };


    // Article Controller

    public getAllArticle = async (req: Request, res: Response, next: NextFunction) => {

        try {
            const page_number = Number(req.query.page) || 1;
            const findAllArticle: Article[] | string = await this.articleService.getAllArticl(page_number);
            res.status(200).json({ data: findAllArticle });
        }
        catch (error) {
            next(error);
        }
    };

    public getArticleById = async (req: Request, res: Response, next: NextFunction) => {

        try {
            const article_id = Number(req.params.id);
            const findArticle: Article | string = await this.articleService.getArticlById(article_id);
            res.status(200).json({ data: findArticle });
        }
        catch (error) {
            next(error);
        }
    };

    public createNewbArticle = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {

            const article_data: CreateArticleDto = req.body;
            const user_id = Number(req.user.uid);
            const newArticle = await this.articleService.createNewArticl(article_data, user_id);
            res.status(200).json({ data: newArticle });
        }
        catch (error) {
            next(error);
        }
    }

    public updateArticle = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const article_data: UpdateArticleDto = req.body;
            const user_id = Number(req.user.uid);
            const article_id = Number(req.params.id);
            const udpateArticle = await this.articleService.upddateArtilce(article_id, article_data, user_id);
            res.status(200).json({ message: udpateArticle });
        }
        catch (error) {
            next(error);
        }
    };

    public deleteArticle = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const user_id = Number(req.user.uid);
            const article_id = Number(req.params.id);
            const deleteArticle = await this.articleService.deleteArticle(article_id, user_id);
            res.status(200).json({ message: deleteArticle });
        }
        catch (error) {
            next(error);
        }
    };

}