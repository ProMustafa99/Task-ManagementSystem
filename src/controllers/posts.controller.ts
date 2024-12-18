import { Container } from 'typedi';
import { PostService } from '@services/posts.service';
import { Request, Response, NextFunction } from 'express';
import { Post } from "@/interfaces/post.interface";
import { CreatePostDto, UpdatePostDto } from '@/dtos/posts.dto';
import { registerSchema } from 'class-validator';
import { json } from 'sequelize';
import { Console } from 'console';
import { RequestWithUser } from '@/interfaces/auth.interface';

export class Postcotroller {
    public post = Container.get(PostService);

    public getAllPosts = async (req: Request, res: Response, next: NextFunction) => {

        try {
            const pageNumber = Number(req.query.page) || 1;
            const findAllPost: Post[] = await this.post.findAllPost(pageNumber);
            res.status(200).json({ data: findAllPost, message: "findAll" });
        }
        catch (error) {
            next(error);
        }
    };

    public getPotsById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const PostId = Number(req.params.id);
            const getPostById: Post = await this.post.findPostById(PostId);

            res.status(200).json({ data: getPostById });
        }
        catch (error) {
            next(error);
        }
    };

    public createPost = async (req:RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const postData: CreatePostDto = req.body;
            postData.created_by = Number(req.user.uid);  
            const CreatePostData: Post = await this.post.createPost(postData);
            res.status(200).json({ data: CreatePostData });
        }
        catch (error) {
            next(error);
        }
    };

    public deletePost = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const PostId = Number(req.params.id);
            await this.post.deletePost(PostId);
            res.status(200).json({ Message: `The post has been deleted`, data: `ID Post : ${PostId}` });
        }
        catch (error) {
            next(error);
        }
    };

    public updatePost = async (req: Request, res: Response, next: NextFunction) => {

        try {
            const PostId = Number(req.params.id);
            const postData: UpdatePostDto = req.body;
            await this.post.updatePost(PostId, postData);
            res.status(200).json({ Message: 'The post has been updated', data: postData })
        }
        catch (error) {
            next(error);
        }
    };

    public activatePost = async (req: Request, res: Response, next: NextFunction) =>{
        try {
            const PostId = Number(req.params.id);
            
        }catch(error) {
            next(error);
        }
    }
}