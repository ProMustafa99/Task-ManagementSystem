import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { TaskType } from '@interfaces/taskType.interface';


export type TaskTypeCreationAttributes = Optional<TaskType, 'id'>;

export class TaskTypeModel extends Model<TaskType, TaskTypeCreationAttributes> implements TaskType {
    public id!: number;
    public title_en!: string;
    public title_ar!: string;
}

export default function (sequelize: Sequelize): typeof TaskTypeModel {
    TaskTypeModel.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            title_ar: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            title_en: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            sequelize,
            tableName: 'task_type',
            timestamps: false,
        }
    );

    return TaskTypeModel;
}
