import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { UserPermission } from "@/interfaces/userPermission.interface";
import { publicDecrypt } from "crypto";

export type UserPermissionCreationAttributes = Optional<UserPermission, 'user_id' | 'id_permission'>;

export class UserPermissionModel extends Model<UserPermission, UserPermissionCreationAttributes> implements UserPermission {
    public user_id: number;
    public id_permission: number;
}

export default function (sequelize: Sequelize): typeof UserPermissionModel {
    UserPermissionModel.init(
        {
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            id_permission: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        },
        {
            tableName: 'User_Permission',
            sequelize,
            timestamps: false
        },
    );

    return UserPermissionModel;
}
