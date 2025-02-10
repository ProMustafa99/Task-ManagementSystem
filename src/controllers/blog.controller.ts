import { CreateArticleDto, UpdateArticleDto } from '@/dtos/article.dto';
import { CreateArticleTagDto } from '@/dtos/article_tag.dto';
import { CreateBlogDto, UpdateBlogDto } from '@/dtos/blog.dto';
import { CreateTagDto, UpdateTagDto } from '@/dtos/tag.dto';
import { Article } from '@/interfaces/article.interface';
import { ArticleTag } from '@/interfaces/article_tag.interface';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { PagenationArticle, PagenationBlog, PagenationTags } from '@/interfaces/pagenation.interface';
import { ArticleService } from '@/services/article.service';
import { ArticleTagsService } from '@/services/article_tags.service';
import { BlogService } from '@/services/blog.service';
import { SearchArticleService } from '@/services/search_article.service';
import { TagService } from '@/services/tag.service';
import cache from '@/utils/cache.utils';
import { ArticleAndPrevious } from '@/interfaces/article_and_prev.interface';
import { RelatedArticle } from '@/interfaces/related_article.interface';

import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import filecache from '../utils/file_cach';

export class BlogMangmentcotroller {
  public blogService = Container.get(BlogService);
  public tagService = Container.get(TagService);
  public articleService = Container.get(ArticleService);
  public articleTagsService = Container.get(ArticleTagsService);
  public search = Container.get(SearchArticleService);

    private Filter(req: Request) {
        const page_number = Number(req.query.page) || 1;
        const status = Number(req.query.record_status) || null;
        const search = typeof req.query.search === 'string' ? req.query.search : null;
    
        return {
          page_number,
          status,
          search,
        };
      }

  // Blog Controller
  public getAllBlogs = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filterBlog = this.Filter(req);
      
      const findAllBlog: PagenationBlog = await this.blogService.getAllBlog(filterBlog.page_number, filterBlog.status, filterBlog.search);
      res.status(200).json(findAllBlog);
    } catch (error) {
      next(error);
    }
  };

    public getBlogById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = Number(req.params.id);

            const blog: Blog | string = await this.blogService.getBlogByID(id);

            res.status(200).json(blog);
        } catch (error) {
            next(error);
        }
    }

  public createNewblog = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const blog_data: CreateBlogDto = req.body;
      const user_id = Number(req.user.uid);
      console.error(user_id);
      const newBlog = await this.blogService.createNewBlog(blog_data, user_id);
      res.status(200).json({ data: newBlog });
      cache.flush();
      filecache.flush();
    } catch (error) {
      next(error);
    }
  };

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
    } catch (error) {
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
    } catch (error) {
      next(error);
      console.error(`Error ${error}`);
    }
  };

    // Tags Controller
    public getAllTags = async (req: Request, res: Response, next: NextFunction) => {

        try {
            const page_number = Number(req.query.page) || 1;

            if (page_number < 0 || page_number > 100000000000000000) {
                res.status(400).json({ message: "Page number is irregular" })
            } else {  
                const findAlltags: Tags[] | string = await this.tagService.getAllTag(page_number);
                res.status(200).json(findAlltags);
            }
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
    } catch (error) {
      next(error);
    }
  };

  public updateStatusTag = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const user_id = Number(req.user.uid);
      const tag_id = Number(req.params.id);
      const newStatus :UpdateTagDto = req.body;
      const updateTag  = await this.tagService.updateStatusTag(tag_id, user_id ,newStatus);
      res.status(200).json({ message: updateTag });
      cache.flush();
      filecache.flush();
    } catch (error) {
      next(error);
      console.error(`Error ${error}`);
    }
  };

  public deleteTag = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const user_id = Number(req.user.uid);
      const tag_id = Number(req.params.id);
      const deletetag = await this.tagService.deleteTag(tag_id, user_id);
      res.status(200).json({ message: deletetag });
      cache.flush();
      filecache.flush();
    } catch (error) {
      next(error);
      console.error(`Error ${error}`);
    }
  };

  // Article Controller
  public getAllArticle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filterArticle = this.Filter(req);
      const page_number = Number(req.query.page) || 1;

            if (page_number < 0 || page_number > 100000000000000000) {
                res.status(400).json({ message: "Page number is irregular" })
            } else {  
          console.error('***********************************',filterArticle);
      const findAllArticle: PagenationArticle = await this.articleService.getAllArticl(
        filterArticle.page_number,
            filterArticle.status,
        filterArticle.search,
      );
      res.status(200).json(findAllArticle);
            }
    } catch (error) {
      next(error);
    }
  };

    public getArticleById = async (req: Request, res: Response, next: NextFunction) => {

        try {
            const article_id = Number(req.params.id);
            const findArticle: Article | string = await this.articleService.getArticlById(article_id);
            res.status(200).json(findArticle);
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
    } catch (error) {
      next(error);
    }
  };

  public updateArticle = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const article_data: UpdateArticleDto = req.body;
      const user_id = Number(req.user.uid);
      const article_id = Number(req.params.id);
      const udpateArticle = await this.articleService.upddateArtilce(article_id, article_data, user_id);
      res.status(200).json({ message: udpateArticle });
      cache.flush();
      filecache.flush();
    } catch (error) {
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
    } catch (error) {
      next(error);
    }
  };

    // Article Tags Controller
    public getTagByArticleId = async (req: Request, res: Response, next: NextFunction) => {

        try {
            const page_number = Number(req.query.page) || 1;

            if (page_number < 0 || page_number > 100000000000000000) {
                res.status(400).json({ message: "Page number is irregular" })
            } else {  
                const article_id = Number(req.params.id);
                const findTagsPerAricle: ArticleTag[] | string = await this.articleTagsService.getTagByArticleId(article_id, page_number);
                res.status(200).json({ data: findTagsPerAricle });
            }
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
    } catch (error) {
      next(error);
    }
  };

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

            if (pageNumber < 0 || pageNumber > 100000000000000000) {
                return res.status(400).json({ message: "Page number is irregular" })
            } 

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
    
    public getActiveTags = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const tags = await this.tagService.getActiveTags();

            return res.status(200).json({message: 'Articles successfully fetched', data: tags})

        } catch (err) {
            next(err);
        }
    }

    public SearchArticleById = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const article_id = Number(req.params.id);
            // const cachekey = `article:${article_id}`;
            // const cachedData = filecache.get<any>(cachekey);

            // if (cachedData) {
            //     return res.status(200).json({
            //         message: "Cached Article fetched successfully",
            //         data: cachedData,
            //     });
            // }

            const findArticle: ArticleAndPrevious | string = await this.search.SearchArticleById(article_id);

      // filecache.set(cachekey, findArticle, 3600);

      res.status(200).json({
        data: findArticle,
      });
    } catch (error) {
      next(error);
    }
  };

    public GetRelatedArticles = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const article_id = Number(req.params.id);
            
            const relatedArticles: RelatedArticle[] = await this.search.GetRelatedArticles(article_id);
            
            console.log(relatedArticles);
                
            res.status(200).json({
                data: relatedArticles
            })
        } catch (error) {
            next(error);
        }
    }
    
    public GetTagArticles = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const tag_id = Number(req.params.id);

            const tagArticles: Article[] = await this.search.GetArticlesByTag(tag_id);

            res.status(200).json({
                data: tagArticles
            });
        } catch (error) {
            next(error);
        }
    }

}