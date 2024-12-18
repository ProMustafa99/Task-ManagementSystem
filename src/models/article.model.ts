import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { Article } from '@interfaces/article.interface';

// Creation Attributes for Article: Optional fields during creation
export type ArticleCreationAttributes = Optional<Article, 'id' | 'updated_on' | 'updated_by' | 'deleted_on' | 'deleted_by' | 'in_links' | 'related_links'>;

export class ArticleModel extends Model<Article, ArticleCreationAttributes> implements Article {
    public id: number;
    public blog_id: number;
    public title_en: string;
    public title_ar: string;
    public url_en: string;
    public url_ar: string;
    public description_en: string;
    public description_ar: string;
    public in_links: string[] | null;
    public related_links: string[] | null;
    public cover_image_url: string;
    public created_on: Date;
    public created_by: number;
    public updated_on: Date | null;
    public updated_by: number | null;
    public deleted_on: Date | null;
    public deleted_by: number | null;
}

export default function (sequelize: Sequelize): typeof ArticleModel {
    ArticleModel.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            blog_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            title_en: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            title_ar: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            url_en: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            url_ar: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            description_en: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            description_ar: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            in_links: {
                type: DataTypes.JSON,
                allowNull: true,
            },
            related_links: {
                type: DataTypes.JSON,
                allowNull: true,
            },
            cover_image_url: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            created_on: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            created_by: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            updated_on: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            updated_by: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            deleted_on: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            deleted_by: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
        },
        {
            tableName: 'article',
            sequelize,
            timestamps: false,
        }
    );

    return ArticleModel;
}
