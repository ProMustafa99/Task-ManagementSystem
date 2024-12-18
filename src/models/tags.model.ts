import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { Tags } from '@interfaces/tags.interface';

export type TagCreationAttributes = Optional<Tags, 'id' | 'updated_on' | 'updated_by' | 'deleted_on' | 'deleted_by'>;

export class TagModel extends Model<Tags, TagCreationAttributes> implements Tags {
    public id: number;
    public title_en: string;
    public title_ar: string;
    public created_on: Date;
    public created_by: number;
    public updated_on: Date | null;
    public updated_by: number | null;
    public deleted_on: Date | null;
    public deleted_by: number | null;
}

export default function (sequelize: Sequelize): typeof TagModel {
    TagModel.init(
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
            tableName: 'tag',
            sequelize,
            timestamps: false,
        }
    );

    return TagModel;
}
