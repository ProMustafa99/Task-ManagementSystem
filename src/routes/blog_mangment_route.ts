import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { AuthMiddleware, Authorization } from '@middlewares/auth.middleware';
import { BlogMangmentcotroller } from '@/controllers/blog.controller';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { CreateBlogDto, UpdateBlogDto } from '@/dtos/blog.dto';
import { CreateArticleDto } from '@/dtos/article.dto';
import { CreateTagDto } from '@/dtos/tag.dto';



const ID_PARAM = ':id(\\d+)'; // Reusable regex for numeric IDs


export class BlogRoute implements Routes {
  
  public pathBlog = '/blog';
  public pathTag = '/tags';
  public pathArticle = '/article';
  public pathArticleTags = '/article/tags';
  public router = Router();
  public blogController: BlogMangmentcotroller;

  constructor(controller: BlogMangmentcotroller = new BlogMangmentcotroller()) {
    this.blogController = controller;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.initializeBlogRoutes();
    this.initializeTagRoutes();
    this.initializeArticleRoutes();
    this.initializeArticleTagRoutes();
  }

  private initializeBlogRoutes(): void {
    this.router.get(this.pathBlog, AuthMiddleware, this.blogController.getAllBlogs);
    this.router.post(this.pathBlog, AuthMiddleware, ValidationMiddleware(CreateBlogDto), this.blogController.createNewblog);
    this.router.put(`${this.pathBlog}/${ID_PARAM}`, AuthMiddleware, ValidationMiddleware(UpdateBlogDto), this.blogController.updateBlog);
    this.router.delete(`${this.pathBlog}/${ID_PARAM}`, AuthMiddleware, this.blogController.deleteBlog);
  }

  private initializeTagRoutes(): void {
    this.router.get(this.pathTag, AuthMiddleware, this.blogController.getAllTags);
    this.router.put(this.pathTag, AuthMiddleware, ValidationMiddleware(CreateTagDto), this.blogController.createNewbTag);
    this.router.delete(`${this.pathTag}/${ID_PARAM}`, AuthMiddleware, this.blogController.deleteTag);
  }

  private initializeArticleRoutes(): void {
    this.router.get(this.pathArticle, AuthMiddleware, this.blogController.getAllArticle);
    this.router.get(`${this.pathArticle}/${ID_PARAM}`, AuthMiddleware, this.blogController.getArticleById);
    this.router.post(this.pathArticle, AuthMiddleware, this.blogController.createNewbArticle);
    this.router.put(`${this.pathArticle}/${ID_PARAM}`, AuthMiddleware, this.blogController.updateArticle);
    this.router.delete(`${this.pathArticle}/${ID_PARAM}`, AuthMiddleware, this.blogController.deleteArticle);
  }

  private initializeArticleTagRoutes(): void {
    this.router.get(`${this.pathArticleTags}/${ID_PARAM}`, AuthMiddleware, this.blogController.getTagByArticleId);
    this.router.post(this.pathArticleTags, AuthMiddleware, this.blogController.createNewTagsForArticle);
    this.router.delete('/article/:article_id/tags/:tag_id', AuthMiddleware,this.blogController.deleteTagsFromArticle);
  }
  
}
