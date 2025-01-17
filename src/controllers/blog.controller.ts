import { Container } from 'typedi';
import { Request, Response, NextFunction } from 'express';
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
import { ArticleTag } from '@/interfaces/article_tag.interface';
import { ArticleTagsService } from '@/services/article_tags.service';
import { CreateArticleTagDto } from '@/dtos/article_tag.dto';
import { SearchArticleService } from '@/services/search_article.service';
import cache from '@/utils/cache.utils';
import filecache from "../utils/file_cach";


export class BlogMangmentcotroller {

    public blogService = Container.get(BlogService);
    public tagService = Container.get(TagService);
    public articleService = Container.get(ArticleService);
    public articleTagsService = Container.get(ArticleTagsService);
    public search = Container.get(SearchArticleService);


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
            console.error(user_id);
            const newBlog = await this.blogService.createNewBlog(blog_data, user_id);
            res.status(200).json({ data: newBlog });
            cache.flush();
            filecache.flush();
        }
        catch (error) {
            next(error);
        }
    }

    public updateBlog = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const blog_data: UpdateBlogDto = req.body;
            console.error(req.body);
            const user_id = Number(req.user.uid);
            const blog_id = Number(req.params.id);
            const udpateBlog = await this.blogService.updateBlog(blog_id, blog_data, user_id);
            res.status(200).json({ message: udpateBlog });
            cache.flush();
            filecache.flush();
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
            cache.flush();
            filecache.flush();
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
            cache.flush();
            filecache.flush();
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
            cache.flush();
            filecache.flush();
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
            cache.flush();
            filecache.flush();
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
            cache.flush();
            filecache.flush();
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
            cache.flush();
            filecache.flush();
        }
        catch (error) {
            next(error);
        }
    };

    // Article Tags Controller
    public getTagByArticleId = async (req: Request, res: Response, next: NextFunction) => {

        try {
            const page_number = Number(req.query.page) || 1;
            const article_id = Number(req.params.id);
            const findTagsPerAricle: ArticleTag[] | string = await this.articleTagsService.getTagByArticleId(article_id, page_number);
            res.status(200).json({ data: findTagsPerAricle });
        }
        catch (error) {
            next(error);
        }
    };

    public createNewTagsForArticle = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const create_tagsforAtricle: CreateArticleTagDto = req.body;
            const user_id = Number(req.user.uid);
            const article_id = Number(req.body.article_id);
            const tag_id = Number(req.body.tag_id);

            console.error(article_id);
            console.error(tag_id);
            const newTag = await this.articleTagsService.createNewTagsForArticle(article_id, tag_id, create_tagsforAtricle, user_id);
            res.status(200).json({ data: newTag });
            cache.flush();
            filecache.flush();
        }
        catch (error) {
            next(error);
        }
    }

    public deleteTagsFromArticle = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const user_id = Number(req.user.uid);
            const article_id = Number(req.params.article_id);
            const tag_id = Number(req.params.tag_id);

            const result = await this.articleTagsService.deleteTagsFormArticle(article_id, tag_id, user_id);
            res.status(200).json({ message: `Tag ${tag_id} successfully removed from article ${article_id}`, data: result });
            cache.flush();
            filecache.flush();
        } catch (error) {
            next(error);
        }
    };

    public SearchArticle = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const searchTerm: string = String(req.query.search_term || '');
            const pageNumber = Number(req.query.page) || 1;
            let message: string = `Articles fetched successfully`;
            const cacheKey = `articles:${searchTerm}:${pageNumber}`;
            
            const cachedData = cache.get<any>(cacheKey);
            if (cachedData) {
                console.log("Cache hit");
                return res.status(200).json({
                    message: "Cached Articles fetched successfully",
                    data: cachedData,
                });
            }
    
            const articles = await this.search.SearchArticles(pageNumber, searchTerm);
    
            if (articles.searchResults.length === 0) {
                message = `Not Found Articles`;
            } 
            else {
                // You can cache the result if needed
                cache.set(cacheKey, articles, 3000);
            }
    
            res.status(200).json({ message: message, data: articles });
        } catch (error) {
            next(error);
        }
    };
    
    public SearchArticleById = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const article_id = Number(req.params.id);
            const cachekey = `article:${article_id}`;
            const cachedData = filecache.get<any>(cachekey);

            if (cachedData) {
                return res.status(200).json({
                    message: "Cached Article fetched successfully",
                    data: cachedData,
                });
            }

            const findArticle: Article | string = await this.search.SearchArticleById(article_id);

            filecache.set(cachekey, findArticle, 3600);

            res.status(200).json({
                data: findArticle
            });

        } catch (error) {
            next(error);
        }
    };

}