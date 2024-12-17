import { Task } from "@/interfaces/task.interface";
import { DATE } from "sequelize";
import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { TaskTypeModel } from "./taskType.model";

// Define creation attributes
export type TaskCreationAttributes = Optional<Task, 'id'>;

export class TaskModel extends Model<Task, TaskCreationAttributes> implements Task {
    id?: number;
    type: number;
    parent_table: string;
    parent_id: number;
    status_id: number;
    assignee: number;
    created_at: Date;
}

export default function (sequelize: Sequelize): typeof TaskModel {

    TaskModel.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        type: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        parent_table: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        parent_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        assignee: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        status_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue :101
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        }
    }, {
        sequelize,
        tableName: 'task',
        timestamps: false,
    });

    return TaskModel;
}
