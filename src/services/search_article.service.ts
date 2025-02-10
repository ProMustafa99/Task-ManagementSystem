import { DB } from '@/database';
import { Service } from 'typedi';
import { QueryTypes } from 'sequelize';
import { Article } from '@/interfaces/article.interface';
import sequelize, { Op, where } from 'sequelize';
import { ArticleAndPrevious } from '@/interfaces/article_and_prev.interface';
import { RelatedArticle } from '@/interfaces/related_article.interface';
import { HttpException } from '@/exceptions/httpException';

@Service()
export class SearchArticleService {
  private description_en: string;
  private description_ar: string;
  private in_link: any;
  private updatedDescriptionEn: string;
  private updatedDescriptionAr: string;

  private replaceLinksInDescription = (description: string, in_link) => {
    const reguler = /@(\w+)/g;
    const matches = description.match(reguler);

    console.error(`matches ${matches}`);

    if (matches) {
      matches.forEach(item => {
        if (in_link?.hasOwnProperty(item)) {
          description = description.replace(item, in_link[item]);
        }
      });
    }
    return description;
  };

  public async SearchArticles(
    pageNumber: number,
    search_term: string,
  ): Promise<{ searchResults: Article[]; totalCount: number; currentPage: number; countPerPage: number; itemsPerPage: number }> {
    const sequelize = DB.sequelize;
    const itemsPerPage = 6;
    const offset = (pageNumber - 1) * itemsPerPage;

    const query = search_term
      ? `
      SELECT
    article.id,
    article.title_en,
    article.in_links,
    SUBSTRING(article.description_en, 1, 150) AS description_en,
    SUBSTRING(article.description_ar, 1, 150) AS description_ar,
    article.cover_image_url,
    (
        SELECT GROUP_CONCAT(tag.title_en ORDER BY tag.title_en)
        FROM tag
        JOIN article_tags ON tag.id = article_tags.tag_id
        WHERE article_tags.article_id = article.id
    ) AS tags
FROM article
JOIN blog ON blog.id = article.blog_id
WHERE
    article.record_status = 2
    AND (
        MATCH (article.title_en, article.description_en) AGAINST (:search_term IN BOOLEAN MODE)
        OR MATCH (blog.title_en) AGAINST (:search_term IN BOOLEAN MODE)
        OR article.id IN (
            SELECT DISTINCT article_tags.article_id
            FROM article_tags
            JOIN tag ON tag.id = article_tags.tag_id
            WHERE MATCH (tag.title_en) AGAINST (:search_term IN BOOLEAN MODE)
        )
    )
GROUP BY article.id
LIMIT :itemsPerPage OFFSET :offset;
    `
      : `
        SELECT
            article.id,
            article.title_en,
            article.in_links,
            SUBSTRING (article.description_en,1,150) AS description_en,
            SUBSTRING (article.description_ar,1,150) AS description_ar,
            article.cover_image_url,
            GROUP_CONCAT(tag.title_en ORDER BY tag.title_en) AS tags
        FROM article
        JOIN blog ON blog.id = article.blog_id
        LEFT JOIN article_tags ON article_tags.article_id = article.id
        LEFT JOIN tag ON tag.id = article_tags.tag_id
        WHERE article.record_status = 2
        GROUP BY article.id
        LIMIT :itemsPerPage OFFSET :offset
    `;

    const countQuery = search_term
      ? `
            SELECT COUNT(DISTINCT article.id) AS totalCount
            FROM article
            JOIN blog ON blog.id = article.blog_id
            LEFT JOIN article_tags ON article_tags.article_id = article.id
            LEFT JOIN tag ON tag.id = article_tags.tag_id
            WHERE
                (
                MATCH (article.title_en, article.description_en) AGAINST (:search_term IN BOOLEAN MODE)
                OR MATCH (blog.title_en) AGAINST (:search_term IN BOOLEAN MODE)
                OR MATCH (tag.title_en) AGAINST (:search_term IN BOOLEAN MODE)
                ) AND article.record_status = 2;
        `
      : `
            SELECT COUNT(DISTINCT article.id) AS totalCount
            FROM article
            WHERE article.record_status = 2;
        `;

    const searchResults: Article[] = await sequelize.query(query, {
      replacements: { search_term, itemsPerPage, offset },
      type: QueryTypes.SELECT,
      raw: true,
    });

    const totalCountRow = await sequelize.query(countQuery, {
      replacements: { search_term },
      type: QueryTypes.SELECT,
    });

    searchResults.map((dataValues, index) => {
      const description_en = dataValues.description_en;
      const description_ar = dataValues.description_ar;
      const in_link = dataValues.in_links;
      this.updatedDescriptionEn = this.replaceLinksInDescription(description_en, in_link);
      this.updatedDescriptionAr = this.replaceLinksInDescription(description_ar, in_link);
      searchResults[index].description_en = this.updatedDescriptionEn;
      searchResults[index].description_ar = this.updatedDescriptionAr;
    });

    const totalCount = (totalCountRow[0] as any).totalCount;
    const countPerPage = searchResults.length;

        return {
            totalCount,
            itemsPerPage,
            countPerPage,
            currentPage: pageNumber,
            searchResults,
        };
    }

    public async GetArticlesByTag(tag_id: number): Promise<Article[]> {
        const getArticleIds = await DB.ArticleTag.findAll({
            attributes: [
                'article_id'
            ],
            where: {
                tag_id,
            }
        });

        const articles = await Promise.all(
            getArticleIds.map((article) => (
                DB.Article.findOne({
                    attributes: [
                        'id',
                        'title_en',
                        'description_en',
                        'cover_image_url'
                    ],
                    where: {
                        id: article.article_id,
                    }
                })
            ))
        );

        return articles;
    }

    public async SearchArticleById(article_id: number): Promise<Article | string> {
        const getBlogName = (field: string) => sequelize.literal(`(SELECT title_en FROM blog WHERE blog.id = ArticleModel.${field})`);

    const article = await DB.Article.findOne({
      attributes: [
        [getBlogName('blog_id'), 'blog_name'],
        'blog_id',
        'title_en',
        'description_en',
        'description_ar',
        'in_links',
        'related_links',
        'cover_image_url',
      ],
      where: {
        id: article_id,
        record_status: 2,
      },
    });

    if (!article) {
      throw new HttpException(404, "No articles found");
    }

    const relatedArticles = await DB.Article.findAll({
      attributes: ['id', 'title_en', 'cover_image_url'],
      where: {
        blog_id: article.blog_id,
        id: { [Op.ne]: article_id },
        record_status: 2,
      },

      limit: 3,
    });

    const lastArticle = await DB.Article.findAll({
      attributes: ['id', 'title_en', 'cover_image_url'],
      where: {
        record_status: 2,
      },
      order: [['created_on', 'DESC']],
      limit: 3,
    });

    let relatedArticleTitles = relatedArticles.map(related => ({
      id: related.id,
      title_en: related.title_en,
      cover_image_url: related.cover_image_url,
    }));

    if (relatedArticles.length === 0) {
      relatedArticleTitles = lastArticle.map(related => ({
        id: related.id,
        title_en: related.title_en,
        cover_image_url: related.cover_image_url,
      }));
    }

    const dataValues = article.dataValues;
    this.description_en = dataValues.description_en;
    this.description_ar = dataValues.description_ar;
    this.in_link = dataValues.in_links[0];

    this.updatedDescriptionEn = this.replaceLinksInDescription(this.description_en, this.in_link);
    this.updatedDescriptionAr = this.replaceLinksInDescription(this.description_ar, this.in_link);

    dataValues.description_en = this.updatedDescriptionEn;
    dataValues.description_ar = this.updatedDescriptionAr;

    dataValues.related_articles = relatedArticleTitles;

    delete dataValues.in_links;

        return dataValues;

    }

    public async GetRelatedArticles(article_id: number): Promise<RelatedArticle[]> {
        const articlesWithSameTags = {};

        const articleTags = await DB.ArticleTag.findAll({
            attributes: [
                'tag_id',
            ],
            where: {
                article_id,
            }
        });

        await Promise.all(

            articleTags.map(async articleTag => {
                const articles = await DB.ArticleTag.findAll({
                attributes: [
                    'article_id'
                ],
                where: {
                    article_id: {
                        [Op.ne]: article_id
                    },
                    tag_id: articleTag.tag_id,
                }
            });

            articles.map(article => {
                if (articlesWithSameTags[article.article_id]) {
                    articlesWithSameTags[article.article_id] += 1;
                } else {
                    articlesWithSameTags[article.article_id] = 1;
                }
            })
        })
        )

        let entries = Object.entries(articlesWithSameTags);

        if (entries.length < 3) {
            const blogId = await DB.sequelize.query(`SELECT blog_id FROM article WHERE article.id = ${article_id}`, { type: QueryTypes.SELECT });

            console.log("Blog id: ", blogId);

            const blogArticles = await DB.Article.findAll({
                attributes: [
                    'id',
                ],
                where: {
                    blog_id: blogId[0]['blog_id']
                }
            });
            
            // blogArticles.forEach(blogArticle => {
            //     entries.push([String(blogArticle.id), 1])
            // });

            for (let i = 0; i < 5; i++) {
                entries.push([String(blogArticles[Math.floor(Math.random() * blogArticles.length)].id), 1])
            }


        };
        
        const sortedEntries = entries.sort((a, b) => Number(b[1]) - Number(a[1]));

        const relatedArticles = await Promise.all(sortedEntries.slice(0, 3).map(async ([article_id]) => await DB.Article.findOne({
            attributes: [
                'id',
                'title_en',
                'cover_image_url'
            ],
            where: {
                id: article_id
            }
        })));

        return relatedArticles;
    }
}    