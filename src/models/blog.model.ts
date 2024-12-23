import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { Blog } from '@interfaces/blog.interface';
import { RecordStatus } from '@/interfaces/record.interface';

export type BlogCreationAttributes = Optional<Blog, 'id' | 'updated_on' | 'updated_by' | 'deleted_on' | 'deleted_by'>;

export class BlogModel extends Model<Blog, BlogCreationAttributes> implements Blog {
    public id: number;
    public title_en: string;
    public title_ar: string;
    public url_en: string;
    public url_ar: string;
    public record_status: RecordStatus;
    public created_on: Date;
    public created_by: number;
    public updated_on: Date;
    public updated_by: number;
    public deleted_on: Date;
    public deleted_by: number;
}

export default function (sequelize: Sequelize): typeof BlogModel {
    BlogModel.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },

            title_en: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            title_ar: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            url_en: {
                type: DataTypes.STRING(255),
                allowNull: false,
                unique:true,
            },
            url_ar: {
                type: DataTypes.STRING(255),
                allowNull: false,
                unique:true,
            },
            record_status: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue :RecordStatus.PINDING
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
            tableName: 'blog',
            sequelize,
            timestamps: false,
        }
    );

    return BlogModel;
}
