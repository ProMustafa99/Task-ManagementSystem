import Sequelize from 'sequelize';
import { NODE_ENV, DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_DATABASE } from '@config';
import { logger } from '@utils/logger';

import UserModel from '@models/users.model';
import PostModel from '@models/post.model';
import UserPermissionModel from '@/models/userPermission.model';
import TaskTypeModel from '@/models/taskType.model';
import TaskModel  from '@/models/task.module';


const sequelize = new Sequelize.Sequelize(DB_DATABASE, DB_USER, DB_PASSWORD, {
  dialect: 'mysql',
  host: DB_HOST,
  port: DB_PORT,
  timezone: '+09:00',
  define: {
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci',
    underscored: true,
    freezeTableName: true,
  },
  pool: {
    min: 0,
    max: 5,
  },
  logQueryParameters: NODE_ENV === 'development',
  logging: (query, time) => {
    logger.info(time + 'ms' + ' ' + query);
  },
  benchmark: true,
});

sequelize.authenticate();

export const DB = {
  Users: UserModel(sequelize),
  Posts: PostModel(sequelize),
  UserPermission: UserPermissionModel(sequelize),
  TaskType: TaskTypeModel(sequelize),
  Task : TaskModel(sequelize),
  sequelize, // connection instance (RAW queries)
  Sequelize, // library
};
