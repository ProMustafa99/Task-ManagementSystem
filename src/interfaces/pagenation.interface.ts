import { Article } from './article.interface';
import { Blog } from './blog.interface';
import { Tags } from './tags.interface';

export interface Pagenation {
  countPerPage: number;
  totalCount: number;
  maxPages: number;
}

export interface PagenationBlog extends Pagenation {
  data: Blog[] | string;
}

export interface PagenationArticle extends Pagenation {
  data: Article[] | string;
}

export interface PagenationTags extends Pagenation {
  data: Tags[] | string;
}
