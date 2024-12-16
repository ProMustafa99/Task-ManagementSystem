import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { User } from '@interfaces/users.interface';

export type UserCreationAttributes = Optional<User, 'uid' | 'user_name' | 'email' | 'status' | 'password'>;

export class UserModel extends Model<User, UserCreationAttributes> implements User {
  public uid: number;
  public user_name: string;
  public email: string;
  public status: number;
  public password: string;
}

export default function (sequelize: Sequelize): typeof UserModel {
  UserModel.init(
    {
      uid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique:true
      },
      status: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      tableName: 'User',
      sequelize,
      timestamps:false
    },
  );

  return UserModel;
}
