import { UserPermission } from '@/interfaces/userPermission.interface';
import { Service } from 'typedi';
import { DB } from '@database';
import { CreateUserPermissionDto } from '@/dtos/user_permission.dto';



@Service()
export class userPermissionService {

    public async getPermission (): Promise<UserPermission[]>  {
        const getpermission:UserPermission[] = await DB.UserPermission.findAll();
        return getpermission;
    }

    public async createUserPermission({permission, user_id}: CreateUserPermissionDto) {
        const createPermission = await  DB.UserPermission.create({
                user_id,
                id_permission: permission,
            });

        return createPermission;
    }

    public async deleteUserPermission(permission: number, user_id: number) {
        const deletePermission = await DB.UserPermission.destroy({
                where: {
                    user_id,
                    id_permission: permission,
                }
            })

        return deletePermission;
    }
}