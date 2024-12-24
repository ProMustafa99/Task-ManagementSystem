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
    this.initializeSearchArticleRoute();
  }

  private initializeBlogRoutes(): void {
    this.router.get(this.pathBlog, AuthMiddleware, Authorization(57),this.blogController.getAllBlogs);
    this.router.post(this.pathBlog, AuthMiddleware, Authorization(58),ValidationMiddleware(CreateBlogDto), this.blogController.createNewblog);
    this.router.put(`${this.pathBlog}/${ID_PARAM}`, Authorization(59),AuthMiddleware, ValidationMiddleware(UpdateBlogDto), this.blogController.updateBlog);
    this.router.delete(`${this.pathBlog}/${ID_PARAM}`, Authorization(60),AuthMiddleware, this.blogController.deleteBlog);
  }

  private initializeTagRoutes(): void {
    this.router.get(this.pathTag, AuthMiddleware,Authorization(61),this.blogController.getAllTags);
    this.router.put(this.pathTag, AuthMiddleware,Authorization(62),ValidationMiddleware(CreateTagDto), this.blogController.createNewbTag);
    this.router.delete(`${this.pathTag}/${ID_PARAM}`,Authorization(63),AuthMiddleware, this.blogController.deleteTag);
  }

  private initializeArticleRoutes(): void {
    this.router.get(this.pathArticle, AuthMiddleware,Authorization(64),this.blogController.getAllArticle);
    this.router.get(`${this.pathArticle}/${ID_PARAM}`,Authorization(65),AuthMiddleware, this.blogController.getArticleById);
    this.router.post(this.pathArticle, AuthMiddleware, Authorization(66),this.blogController.createNewbArticle);
    this.router.put(`${this.pathArticle}/${ID_PARAM}`,Authorization(67),AuthMiddleware, this.blogController.updateArticle);
    this.router.delete(`${this.pathArticle}/${ID_PARAM}`,Authorization(68),AuthMiddleware, this.blogController.deleteArticle);
  }

  private initializeArticleTagRoutes(): void {
    this.router.get(`${this.pathArticleTags}/${ID_PARAM}`,Authorization(69),AuthMiddleware, this.blogController.getTagByArticleId);
    this.router.post(this.pathArticleTags, AuthMiddleware,Authorization(70),this.blogController.createNewTagsForArticle);
    this.router.delete('/article/:article_id/tags/:tag_id',Authorization(71),AuthMiddleware,this.blogController.deleteTagsFromArticle);
  }

  // External Api 
  private initializeSearchArticleRoute(): void {
    this.router.get('/article/search',this.blogController.SearchArticle);
  }
  
}
