import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { Post } from "@/interfaces/post.interface";

export type PostCreationAttributes = Optional<Post, 'id' | 'title_en' | 'title_ar' | 'description_en' | 'description_ar' | 'state_id'>;

export class PostModel extends Model<Post, PostCreationAttributes> implements Post {
    public id: number;
    public title_en: string;
    public title_ar: string;
    public description_ar: string;
    public description_en: string;
    public state_id: number;
    public created_by: number;
    public created_on: Date;
}

export default function (sequelize: Sequelize): typeof PostModel {
    PostModel.init({
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        title_en: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        title_ar: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description_en: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description_ar: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        state_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue:101
        },
        created_by: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'created_by'  // Ensures Sequelize maps to the correct column
         },
        created_on: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        }

    }, {
        sequelize,
        tableName: 'Post',
        timestamps: false
    });
    return PostModel;
}
