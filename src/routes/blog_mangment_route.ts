import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { AuthMiddleware, Authorization } from '@middlewares/auth.middleware';
import { BlogMangmentcotroller } from '@/controllers/blog.controller';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { CreateBlogDto, UpdateBlogDto } from '@/dtos/blog.dto';
import { CreateArticleDto, UpdateArticleDto } from '@/dtos/article.dto';
import { CreateTagDto } from '@/dtos/tag.dto';
import { CreateArticleTagDto } from '@/dtos/article_tag.dto';



const ID_PARAM = ':id(\\d+)'; // Reusable regex for numeric IDs


export class BlogRoute implements Routes {

  public pathBlog = '/blog';
  public pathTag = '/tags';
  public pathArticle = '/article';
  public pathArticleTags = '/article/tags';
  public pathExtenrnal ='/blog-articles';
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
    this.router.get(this.pathBlog, AuthMiddleware, Authorization(57), this.blogController.getAllBlogs);
    this.router.get(`${this.pathBlog}/${ID_PARAM}`, AuthMiddleware, Authorization(57), this.blogController.getBlogById);
    this.router.post(this.pathBlog, AuthMiddleware, Authorization(58), ValidationMiddleware(CreateBlogDto), this.blogController.createNewblog);
    this.router.put(`${this.pathBlog}/${ID_PARAM}`,AuthMiddleware, Authorization(59), ValidationMiddleware(UpdateBlogDto), this.blogController.updateBlog);
    this.router.delete(`${this.pathBlog}/${ID_PARAM}`, AuthMiddleware,Authorization(60),  this.blogController.deleteBlog);
  }

  // AuthMiddleware, Authorization(61),
  private initializeTagRoutes(): void {
    this.router.get(this.pathTag, this.blogController.getAllTags);
    this.router.get(`${this.pathTag}/active`, this.blogController.getActiveTags);
    this.router.post(this.pathTag, AuthMiddleware, Authorization(62), ValidationMiddleware(CreateTagDto), this.blogController.createNewbTag);
    this.router.delete(`${this.pathTag}/${ID_PARAM}`, AuthMiddleware, Authorization(63), this.blogController.deleteTag);
  }

  private initializeArticleRoutes(): void {
    this.router.get(this.pathArticle, this.blogController.getAllArticle);
    this.router.get(`${this.pathArticle}/${ID_PARAM}`, AuthMiddleware, Authorization(65), this.blogController.getArticleById);
    this.router.post(this.pathArticle, AuthMiddleware, Authorization(66),ValidationMiddleware(CreateArticleDto), this.blogController.createNewbArticle);
    this.router.put(`${this.pathArticle}/${ID_PARAM}`, AuthMiddleware, Authorization(67),ValidationMiddleware(UpdateArticleDto), this.blogController.updateArticle);
    this.router.delete(`${this.pathArticle}/${ID_PARAM}`, AuthMiddleware, Authorization(68), this.blogController.deleteArticle);
  }

  private initializeArticleTagRoutes(): void {
    this.router.get(`${this.pathArticleTags}/${ID_PARAM}`, AuthMiddleware, Authorization(69), this.blogController.getTagByArticleId);
    this.router.post(this.pathArticleTags, AuthMiddleware, Authorization(70),ValidationMiddleware(CreateArticleTagDto),this.blogController.createNewTagsForArticle);
    this.router.delete('/article/:article_id/tags/:tag_id', AuthMiddleware, Authorization(71), this.blogController.deleteTagsFromArticle);
  }

  // External Api 
  private initializeSearchArticleRoute(): void {
    this.router.get(`${this.pathExtenrnal}`, this.blogController.SearchArticle);
    this.router.get(`${this.pathExtenrnal}/${ID_PARAM}`, this.blogController.SearchArticleById);
    this.router.get(`${this.pathExtenrnal}/related-articles/${ID_PARAM}`, this.blogController.GetRelatedArticles);
    this.router.get(`${this.pathExtenrnal}/tags`, this.blogController.getActiveTags);
    this.router.get(`${this.pathExtenrnal}/tag/${ID_PARAM}`, this.blogController.GetTagArticles);
  }

}
