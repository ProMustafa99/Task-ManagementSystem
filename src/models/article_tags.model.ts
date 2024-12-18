import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { ArticleTag } from '@interfaces/article_tag.interface';

export type ArticleTagCreationAttributes = Optional<ArticleTag, 'id'>;

export class ArticleTagModel extends Model<ArticleTag, ArticleTagCreationAttributes> implements ArticleTag {
    public id!: number;
    public article_id!: number;
    public tag_id!: number;
}

export default function (sequelize: Sequelize): typeof ArticleTagModel {
    ArticleTagModel.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            article_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            tag_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            tableName: 'article_tags',
            sequelize,
            timestamps: false,
        }
    );

    return ArticleTagModel;
}
