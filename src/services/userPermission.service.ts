import { UserPermission } from '@/interfaces/userPermission.interface';
import { Service } from 'typedi';
import { DB } from '@database';



@Service()
export class userPermissionService {

    public async getPermission (): Promise<UserPermission[]>  {
        const getpermission:UserPermission[] = await DB.UserPermission.findAll();
        return getpermission;
    }
}