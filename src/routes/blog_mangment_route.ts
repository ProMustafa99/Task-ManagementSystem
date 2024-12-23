import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { AuthMiddleware, Authorization } from '@middlewares/auth.middleware';
import { BlogMangmentcotroller } from '@/controllers/blog.controller';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { CreateBlogDto, UpdateBlogDto } from '@/dtos/blog.dto';
import { CreateArticleDto } from '@/dtos/article.dto';



export class BlogRoute implements Routes {
  public pathBlog = '/blog';
  public pathTag = '/tags';
  public pathArticle = '/article'
  public router = Router();
  public blog = new BlogMangmentcotroller();


  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Blog

    this.router.get(`${this.pathBlog}`, AuthMiddleware, this.blog.getAllBlogs);
    this.router.post(`${this.pathBlog}`, AuthMiddleware, ValidationMiddleware(CreateBlogDto), this.blog.createNewblog);
    this.router.put(`${this.pathBlog}/:id(\\d+)`, AuthMiddleware, ValidationMiddleware(UpdateBlogDto), this.blog.updateBlog);
    this.router.delete(`${this.pathBlog}/:id(\\d+)`, AuthMiddleware, this.blog.deleteBlog);

    // Tags 
    this.router.get(`${this.pathTag}`, AuthMiddleware, this.blog.getAllTags);
    this.router.put(`${this.pathTag}`, AuthMiddleware, ValidationMiddleware(CreateArticleDto), this.blog.createNewbTag);
    this.router.delete(`${this.pathTag}/:id(\\d+)`, AuthMiddleware, this.blog.deleteTag);

    // Article
    this.router.get(`${this.pathArticle}`, AuthMiddleware, this.blog.getAllArticle);
    this.router.get(`${this.pathArticle}/:id(\\d+)`, AuthMiddleware, this.blog.getArticleById);
    this.router.post(`${this.pathArticle}`, AuthMiddleware, this.blog.createNewbArticle);
    this.router.put(`${this.pathArticle}/:id(\\d+)`, AuthMiddleware, this.blog.updateArticle);
    this.router.delete(`${this.pathArticle}/:id(\\d+)`, AuthMiddleware, this.blog.deleteArticle);

    //


  }
}
