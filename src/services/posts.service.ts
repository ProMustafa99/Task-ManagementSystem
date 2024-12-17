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

    private taskService = Container.get(TaskService);

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
        const taskCount = await this.taskService.fetchTaskCount();
        await this.taskService.createNewTask(createpost, "post", 67,"Active Post");

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
        const [updatedPost] = await DB.Posts.update({ ...PostData }, { where: { id: postId } });
        const findPost = await DB.Posts.findByPk(postId);

        if (PostData.state_id === 300) {
            console.error(PostData);
            setTimeout(async ()=>{
                await this.taskService.createNewTask(2,findPost, "post");
            }, 2000);
        }
        return updatedPost;
    }
}



