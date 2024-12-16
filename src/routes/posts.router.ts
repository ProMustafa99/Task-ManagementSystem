import { Router } from "express";
import { Postcotroller } from "@/controllers/posts.controller";
import { Routes } from '@interfaces/routes.interface';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { AuthMiddleware ,Authorization } from "@/middlewares/auth.middleware";
import { CreatePostDto ,UpdatePostDto } from "@/dtos/posts.dto";


export class PostRouter implements Routes {
    public path = '/posts';
    public router = Router();
    public post = new Postcotroller();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}`, AuthMiddleware,Authorization(52), this.post.getAllPosts);
        this.router.get(`${this.path}/:id`, AuthMiddleware,Authorization(52),this.post.getPotsById);
        this.router.post(`${this.path}`, AuthMiddleware,Authorization(8),ValidationMiddleware(CreatePostDto),this.post.createPost);
        this.router.put(`${this.path}/:id`, AuthMiddleware,Authorization(10),ValidationMiddleware(UpdatePostDto),this.post.updatePost)
        this.router.delete(`${this.path}/:id`, AuthMiddleware,Authorization(9),this.post.deletePost);
    }
}