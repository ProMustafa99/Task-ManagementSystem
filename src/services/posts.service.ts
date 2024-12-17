import { Service } from 'typedi';
import { DB } from '@database';
import { promises } from 'dns';
import { Post } from "@/interfaces/post.interface";
import { HttpException } from '@/exceptions/httpException';
import { CreatePostDto, UpdatePostDto } from '@/dtos/posts.dto';
import sequelize from 'sequelize';
import { TaskService } from './task.service';
import { Container } from 'typedi';


@Service()
export class PostService {

    public async findAllPost(pageNumber: number): Promise<Post[]> {
        const offset = (pageNumber - 1) * 5;

        const allPost: Post[] = await DB.Posts.findAll({
            offset: offset,
            limit: 5,
        });


        return allPost;
    }

    public async findPostById(postId: number): Promise<Post> {
        const postById: Post = await DB.Posts.findByPk(postId);
        return postById;
    }

    public async createPost(postData: CreatePostDto): Promise<Post> {

        const createpost: Post = await DB.Posts.create({ ...postData });
        const taskService = Container.get(TaskService);
        const taskCount = await taskService.fetchTaskCount();
        console.error(`Total tasks: ${taskCount}`);

        await taskService.createNewTask(createpost,"post",67);
        return createpost;
    }

    public async deletePost(postId: number): Promise<number> {
        const [deletepost] = await DB.Posts.update({ state_id: 102 }, {
            where: {
                id: postId
            }
        });

        return deletepost;
    }

    public async updatePost(postId: number, PostData: UpdatePostDto): Promise<number> {
        const [updatedUser] = await DB.Posts.update({ ...PostData }, { where: { id: postId } });
        return updatedUser;
    }

    public async activatedPost() {

        const findAllPostsUnactive = await DB.Posts.findAll({
            where : {state_id:101}
        });
        return findAllPostsUnactive;
    }
}



