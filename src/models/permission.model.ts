// export type PermissionCreationAttributes = Optional<UserPermission, 'user_id' | 'id_permission'>;

import { Permission } from "@/interfaces/permission.interface";
import { DataTypes, Model, Sequelize } from "sequelize";

export class PermissionModel extends Model<Permission> implements Permission {
    public id: number;
    public Name: string;
}

export default function (sequelize: Sequelize): typeof PermissionModel {
    PermissionModel.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false
            },
            Name: {
                type: DataTypes.STRING,
                allowNull: false
            }
        },
        {
            tableName: 'Permission',
            sequelize,
            timestamps: false
        },
    );

    return PermissionModel;
}