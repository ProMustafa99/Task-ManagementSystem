import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { AuthMiddleware, Authorization } from '@middlewares/auth.middleware';
import { Blogcotroller } from '@/controllers/blog.controller';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { CreateBlogDto, UpdateBlogDto } from '@/dtos/blog.dto';



export class BlogRoute implements Routes {
  public path = '/blog';
  public router = Router();
  public blog = new Blogcotroller();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`,AuthMiddleware,this.blog.getAllBlogs);
    this.router.post(`${this.path}`,AuthMiddleware,ValidationMiddleware(CreateBlogDto),this.blog.createNewblog);
    this.router.put(`${this.path}/:id(\\d+)`,AuthMiddleware,ValidationMiddleware(UpdateBlogDto),this.blog.updateblog);
    this.router.delete(`${this.path}/:id(\\d+)`,AuthMiddleware,this.blog.deleteblog);


  }
}
