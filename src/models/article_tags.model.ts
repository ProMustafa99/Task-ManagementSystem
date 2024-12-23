import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { ArticleTag } from '@interfaces/article_tag.interface';
import { RecordStatus } from '@/interfaces/record.interface';

export type ArticleTagCreationAttributes = Optional<ArticleTag, 'id'>;

export class ArticleTagModel extends Model<ArticleTag, ArticleTagCreationAttributes> implements ArticleTag {
    public id!: number;
    public article_id!: number;
    public tag_id!: number;
    public record_status: RecordStatus;
    public created_on: Date;
    public created_by: number;
    public updated_on: Date;
    public updated_by: number;
    public deleted_on: Date;
    public deleted_by: number;
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
            record_status: {
                type: DataTypes.INTEGER,
                defaultValue: RecordStatus.ACTIVE,
                allowNull: false
            },
            created_on: {
                type: DataTypes.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                allowNull: false,
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
            tableName: 'article_tags',
            sequelize,
            timestamps: false,
        }
    );

    return ArticleTagModel;
}
